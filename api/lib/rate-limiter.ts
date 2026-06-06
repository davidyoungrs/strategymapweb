import crypto from 'crypto';
import { db } from './firebase-admin';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export async function checkRateLimit(
  ip: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  
  // Hash the IP address for client privacy
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
  const docRef = db.collection('rate_limits').doc(ipHash);
  
  try {
    const docSnap = await docRef.get();
    let timestamps: number[] = [];
    
    if (docSnap.exists) {
      const data = docSnap.data();
      if (data && Array.isArray(data.timestamps)) {
        timestamps = data.timestamps;
      }
    }
    
    // Filter out timestamps outside the sliding window
    const activeTimestamps = timestamps.filter((t: number) => now - t < windowMs);
    
    if (activeTimestamps.length >= limit) {
      const oldest = Math.min(...activeTimestamps);
      return {
        allowed: false,
        remaining: 0,
        resetTime: oldest + windowMs
      };
    }
    
    // Add current request timestamp
    activeTimestamps.push(now);
    await docRef.set({ timestamps: activeTimestamps });
    
    return {
      allowed: true,
      remaining: limit - activeTimestamps.length,
      resetTime: 0
    };
  } catch (error) {
    console.error('Rate Limiter Error:', error);
    // If rate limiting fails (e.g. DB connection issues), fail-open to not block legitimate users,
    // but log the failure.
    return {
      allowed: true,
      remaining: 1,
      resetTime: 0
    };
  }
}
