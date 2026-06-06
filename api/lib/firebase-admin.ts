import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  try {
    const b64Config = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
    
    if (b64Config) {
      const jsonConfig = JSON.parse(Buffer.from(b64Config, 'base64').toString('utf8'));
      initializeApp({
        credential: cert(jsonConfig),
      });
      console.log('Firebase Admin initialized via Base64 JSON');
    } else {
      const rawKey = process.env.FIREBASE_PRIVATE_KEY;
      if (rawKey) {
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
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

const databaseId = process.env.FIREBASE_FIRESTORE_DATABASE_ID || 'ai-studio-51d41aa2-0bcf-4c7d-9cab-69a1a391248c';
export const db = getFirestore(databaseId);
export { FieldValue } from 'firebase-admin/firestore';
