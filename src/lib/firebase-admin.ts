import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function formatPrivateKey(key?: string) {
  if (!key) return undefined;
  return key.replace(/\\n/g, '\n');
}

export function getFirebaseAdmin() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'aix-rt';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!clientEmail || !privateKey) {
    return null;
  }

  try {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (err) {
    console.error('Firebase Admin initialization error:', err);
    return null;
  }
}

export function getFirestoreDb() {
  const app = getFirebaseAdmin();
  if (!app) return null;
  return getFirestore(app);
}
