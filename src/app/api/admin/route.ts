import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { loadContentFile } from '@/lib/content';
import { getFirestoreDb } from '@/lib/firebase-admin';

const contentDir = path.join(process.cwd(), 'content');

const ALLOWED_FILES = new Set([
  'site.json',
  'home.json',
  'about.json',
  'programme.json',
  'roundtables.json',
  'partners.json',
  'showcase.json',
  'venue.json',
  'signals.json',
  'contact.json',
  'faq.json',
]);

function isSafeFilePath(fileName: string | null): string | null {
  if (!fileName || !ALLOWED_FILES.has(fileName)) return null;
  const resolved = path.resolve(contentDir, fileName);
  if (!resolved.startsWith(path.resolve(contentDir))) return null;
  return resolved;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file || !ALLOWED_FILES.has(file)) {
    return NextResponse.json({ error: 'Invalid or disallowed file' }, { status: 400 });
  }

  try {
    // 1. Try reading live from Firestore first
    const db = getFirestoreDb();
    if (db) {
      const docId = file.replace('.json', '');
      const doc = await db.collection('content').doc(docId).get();
      if (doc.exists) {
        const data = doc.data();
        if (data && data.payload) {
          // Update in-memory cache as well
          if (typeof globalThis !== 'undefined') {
            globalThis.__CMS_CACHE__ = globalThis.__CMS_CACHE__ || {};
            globalThis.__CMS_CACHE__[file] = data.payload;
          }
          return NextResponse.json({ content: data.payload, source: 'firestore' });
        }
      }
    }

    // 2. Fall back to local file / memory cache
    const content = loadContentFile(file);
    return NextResponse.json({ content, source: 'fallback' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'File not found' }, { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const { file, content } = await request.json();
    const safePath = isSafeFilePath(file);
    if (!safePath) {
      return NextResponse.json({ error: 'Invalid or disallowed file' }, { status: 400 });
    }

    // 1. Update in-memory global cache for immediate response
    if (typeof globalThis !== 'undefined') {
      globalThis.__CMS_CACHE__ = globalThis.__CMS_CACHE__ || {};
      globalThis.__CMS_CACHE__[file] = content;
    }

    // 2. Save directly to Firebase Firestore (persists globally across all Vercel instances & visitors)
    let firestoreSaved = false;
    try {
      const db = getFirestoreDb();
      if (db) {
        const docId = file.replace('.json', '');
        await db.collection('content').doc(docId).set({
          payload: content,
          updatedAt: new Date().toISOString(),
          file,
        });
        firestoreSaved = true;
      }
    } catch (fsDbErr) {
      console.warn('Could not save to Firestore:', fsDbErr);
    }

    // 3. Try writing to /tmp/content
    try {
      const tmpDir = path.join('/tmp', 'content');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      fs.writeFileSync(path.join(tmpDir, file), JSON.stringify(content, null, 2), 'utf8');
    } catch (tmpErr) {
      console.warn('Could not write to /tmp:', tmpErr);
    }

    // 4. Try writing to local content directory on disk (local development)
    try {
      fs.writeFileSync(safePath, JSON.stringify(content, null, 2), 'utf8');
    } catch (fsErr) {
      // In read-only Vercel serverless environment, this is expected
    }

    // 5. Trigger on-demand revalidation
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/', 'page');
      revalidatePath('/roundtables', 'page');
      revalidatePath('/programme', 'page');
      revalidatePath('/partners', 'page');
      revalidatePath('/about', 'page');
      revalidatePath('/signals', 'page');
      revalidatePath('/contact', 'page');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({
      success: true,
      firestoreSaved,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not save file' }, { status: 500 });
  }
}
