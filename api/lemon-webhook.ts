import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, FieldValue } from './lib/firebase-admin';
import { checkRateLimit } from './lib/rate-limiter';

// We need the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable: any): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enforce IP-based rate limiting (60 requests per 15 minutes)
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = await checkRateLimit(clientIp, 60, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString());
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('LEMON_SQUEEZY_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Internal server error' });
  }

  // Get raw body
  const rawBody = await getRawBody(req);
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(req.headers['x-signature'] as string || '', 'utf8');

  // Use timingSafeEqual to prevent timing attacks
  if (signature.length !== digest.length || !crypto.timingSafeEqual(digest, signature)) {
    console.error('Invalid signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Parse body manually since we disabled bodyParser
  const payload = JSON.parse(rawBody.toString());
  
  const eventName = payload.meta.event_name;
  const userId = payload.meta.custom_data?.user_id;

  console.log(`Processing event: ${eventName} for user: ${userId}`);

  if (!userId) {
    if (eventName.startsWith('subscription_')) {
      console.warn('User ID missing in custom_data for subscription event');
      return res.status(400).json({ error: 'User ID missing in custom_data' });
    }
    return res.status(200).json({ received: true, message: 'No userId, skipping' });
  }

  const userRef = db.collection('users').doc(userId);

  try {
    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_resumed':
      case 'subscription_unpaused':
        const status = payload.data.attributes.status;
        // In Lemon Squeezy, "on_trial" and "active" are the paid states. 
        // "cancelled" is also paid until the end of the billing period (status remains "active" until expiry)
        const isPaid = status === 'active' || status === 'on_trial';
        const portalUrl = payload.data.attributes.urls?.customer_portal;
        
        await userRef.set({
          isPaidTier: isPaid,
          subscriptionId: payload.data.id,
          subscriptionStatus: status,
          customerPortalUrl: portalUrl,
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
        break;

      case 'subscription_cancelled':
        // NOTE: We don't necessarily set isPaidTier to false here because 
        // they might still have time left on their month. 
        // We update the status so the UI can show "Cancelled (expires on...)"
        await userRef.set({
          subscriptionStatus: 'cancelled',
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
        break;

      case 'subscription_expired':
      case 'subscription_paused':
        await userRef.set({
          isPaidTier: false,
          subscriptionStatus: eventName === 'subscription_paused' ? 'paused' : 'expired',
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
        break;

      default:
        console.log(`Unhandled event type: ${eventName}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Failed to update user status' });
  }
}
