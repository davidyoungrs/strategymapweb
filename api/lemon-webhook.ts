import crypto from 'crypto';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Firebase Admin
if (!getApps().length) {
  try {
    const b64Config = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
    
    if (b64Config) {
      // Best way: use the base64 encoded JSON
      const jsonConfig = JSON.parse(Buffer.from(b64Config, 'base64').toString('utf8'));
      initializeApp({
        credential: cert(jsonConfig),
      });
      console.log('Firebase Admin initialized via Base64 JSON');
    } else {
      // Fallback to individual env vars (for local dev or if not using b64)
      const rawKey = process.env.FIREBASE_PRIVATE_KEY;
      if (!rawKey) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_B64 or FIREBASE_PRIVATE_KEY');

      const formattedKey = rawKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '').trim();
      
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: formattedKey,
        }),
      });
      console.log('Firebase Admin initialized via individual env vars');
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

const db = getFirestore('ai-studio-51d41aa2-0bcf-4c7d-9cab-69a1a391248c');

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

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('LEMON_SQUEEZY_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Internal server error' });
  }

  // Get raw body
  const rawBody = await getRawBody(req);
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(rawBody).digest('hex');
  const signature = req.headers['x-signature'] as string;

  if (signature !== digest) {
    console.error('Invalid signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Parse body manually since we disabled bodyParser
  const payload = JSON.parse(rawBody.toString());
  
  // Deep log for debugging
  console.log('Webhook Meta:', JSON.stringify(payload.meta, null, 2));
  
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
        const status = payload.data.attributes.status;
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
      case 'subscription_expired':
        await userRef.set({
          isPaidTier: false,
          subscriptionStatus: 'cancelled',
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
