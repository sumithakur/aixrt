import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getFirestoreDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const mimeMap: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    const ext = path.extname(filename).toLowerCase();
    const defaultMime = mimeMap[ext] || 'application/octet-stream';

    // 1. Check in-memory cache
    if (typeof globalThis !== 'undefined' && (globalThis as any).__IMAGE_CACHE__?.[filename]) {
      const cached = (globalThis as any).__IMAGE_CACHE__[filename];
      return new NextResponse(cached.buffer, {
        status: 200,
        headers: {
          'Content-Type': cached.contentType || defaultMime,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. Check local filesystem public/brand/[filename]
    try {
      const localPath = path.join(process.cwd(), 'public', 'brand', filename);
      if (fs.existsSync(localPath)) {
        const buffer = fs.readFileSync(localPath);
        if (typeof globalThis !== 'undefined') {
          (globalThis as any).__IMAGE_CACHE__ = (globalThis as any).__IMAGE_CACHE__ || {};
          (globalThis as any).__IMAGE_CACHE__[filename] = { buffer, contentType: defaultMime };
        }
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': defaultMime,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (diskErr) {
      // Local disk check failed or not found, fall through to Firestore
    }

    // 3. Check Firestore uploads collection
    try {
      const db = getFirestoreDb();
      if (db) {
        const doc = await db.collection('uploads').doc(filename).get();
        if (doc && doc.exists) {
          const data = doc.data();
          if (data && data.data) {
            const buffer = Buffer.from(data.data, 'base64');
            const contentType = data.contentType || defaultMime;
            if (typeof globalThis !== 'undefined') {
              (globalThis as any).__IMAGE_CACHE__ = (globalThis as any).__IMAGE_CACHE__ || {};
              (globalThis as any).__IMAGE_CACHE__[filename] = { buffer, contentType };
            }
            return new NextResponse(buffer, {
              status: 200,
              headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
              },
            });
          }
        }
      }
    } catch (fsErr) {
      console.warn(`Firestore read error for upload ${filename}:`, fsErr);
    }

    return new NextResponse('Image not found', { status: 404 });
  } catch (error: any) {
    console.error('Error serving upload:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
