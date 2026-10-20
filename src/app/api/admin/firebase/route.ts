import { NextResponse } from 'next/server';
import { getFirestoreDb } from '@/lib/firebase-admin';
import { loadContentFile } from '@/lib/content';
import { CONTENT_FILES } from '@/lib/content-files';

export const dynamic = 'force-dynamic';

/** Names the environment variables Firebase needs but does not have. */
function missingEnv() {
  const required = ['FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
  return required.filter((key) => !process.env[key]);
}

/**
 * Reports whether the CMS is actually writing through to Firebase, and when each
 * content file last reached it. Without this the panel could only say a save
 * "succeeded" — which on Vercel may mean it was written to a temporary disk that
 * the next deployment discards.
 */
export async function GET() {
  const missing = missingEnv();
  const projectId = process.env.FIREBASE_PROJECT_ID || 'aix-rt';

  const db = getFirestoreDb();
  if (!db) {
    return NextResponse.json({
      connected: false,
      projectId,
      missingEnv: missing,
      reason:
        missing.length > 0
          ? `Firebase credentials are not set on this deployment: ${missing.join(', ')}.`
          : 'Firebase Admin could not start with the credentials provided.',
      documents: [],
    });
  }

  try {
    const snapshot = await Promise.race([
      db.collection('content').get(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Firestore timed out after 5s')), 5000)),
    ]);

    const stored: Record<string, string> = {};
    (snapshot as any).forEach((doc: any) => {
      stored[`${doc.id}.json`] = doc.data()?.updatedAt || '';
    });

    const documents = CONTENT_FILES.map((file) => ({
      file,
      inFirebase: Boolean(stored[file]),
      updatedAt: stored[file] || null,
    }));

    return NextResponse.json({
      connected: true,
      projectId,
      missingEnv: [],
      reason: null,
      documents,
    });
  } catch (err: any) {
    const message = String(err?.message || err);
    return NextResponse.json({
      connected: false,
      projectId,
      missingEnv: missing,
      reason:
        err?.code === 5 || message.includes('NOT_FOUND')
          ? 'The Firestore database has not been created yet. In the Firebase console, open Firestore and click "Create database".'
          : message,
      documents: [],
    });
  }
}

/**
 * Writes every content file to Firebase in one pass. Used to seed a newly
 * connected project, or to repair files that were edited while Firebase was down
 * and so only ever reached local disk.
 */
export async function POST() {
  const db = getFirestoreDb();
  if (!db) {
    return NextResponse.json(
      { error: `Firebase is not connected. Missing: ${missingEnv().join(', ') || 'credentials'}` },
      { status: 503 }
    );
  }

  const results: { file: string; ok: boolean; error?: string }[] = [];

  for (const file of CONTENT_FILES) {
    try {
      const content = loadContentFile(file);
      await db
        .collection('content')
        .doc(file.replace('.json', ''))
        .set({ payload: content, updatedAt: new Date().toISOString(), file });
      results.push({ file, ok: true });
    } catch (err: any) {
      results.push({ file, ok: false, error: String(err?.message || err) });
    }
  }

  const failed = results.filter((r) => !r.ok);
  return NextResponse.json(
    { synced: results.length - failed.length, total: results.length, failed, results },
    { status: failed.length ? 207 : 200 }
  );
}
