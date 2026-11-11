import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getFirestoreDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const allowedMimes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    const contentType = allowedMimes[ext];
    if (!contentType) {
      return NextResponse.json(
        { error: 'Only image files (.png, .jpg, .jpeg, .webp, .avif, .svg) are allowed' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Limit file size to 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit. Please upload a smaller image.' },
        { status: 400 }
      );
    }

    // Validate content format
    if (ext === '.svg') {
      const svgText = buffer.toString('utf8');
      if (!svgText.includes('<svg') && !svgText.includes('<?xml')) {
        return NextResponse.json({ error: 'Invalid SVG file content' }, { status: 400 });
      }
      if (/<script/i.test(svgText)) {
        return NextResponse.json({ error: 'SVG files with executable scripts are not allowed' }, { status: 400 });
      }
    } else {
      const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
      const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      const isRiff = buffer.toString('ascii', 0, 4) === 'RIFF';
      const isFtyp = buffer.toString('ascii', 4, 8) === 'ftyp';

      if (!isPng && !isJpeg && !isRiff && !isFtyp) {
        return NextResponse.json({ error: 'Invalid image file content' }, { status: 400 });
      }
    }

    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const safeFileName = `${baseName || 'logo'}-${Date.now()}${ext}`;
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${contentType};base64,${base64Data}`;

    // 1. Try saving to local public/brand directory (works on local dev & writable environments)
    let localDiskSaved = false;
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'brand');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadDir, safeFileName), buffer);
      localDiskSaved = true;
    } catch (diskErr: any) {
      // Expected in serverless read-only environments (e.g. Vercel)
      console.warn('Local disk write skipped (read-only environment):', diskErr?.message);
    }

    // 2. Save to Firestore uploads collection for global multi-instance persistence
    let firestoreSaved = false;
    try {
      const db = getFirestoreDb();
      if (db) {
        await db.collection('uploads').doc(safeFileName).set({
          data: base64Data,
          contentType,
          fileName: file.name,
          size: buffer.length,
          createdAt: new Date().toISOString(),
        });
        firestoreSaved = true;

        if (typeof globalThis !== 'undefined') {
          (globalThis as any).__IMAGE_CACHE__ = (globalThis as any).__IMAGE_CACHE__ || {};
          (globalThis as any).__IMAGE_CACHE__[safeFileName] = { buffer, contentType };
        }
      }
    } catch (fsErr: any) {
      console.warn('Firestore image upload error:', fsErr?.message);
    }

    // 3. Determine the best URL to return
    // If Firestore or local disk saved, we serve from /api/uploads/safeFileName
    // If neither saved (e.g. no Firebase credentials and read-only disk), return the dataUrl directly!
    const canonicalUrl = (firestoreSaved || localDiskSaved)
      ? `/api/uploads/${safeFileName}`
      : dataUrl;

    return NextResponse.json({
      success: true,
      url: canonicalUrl,
      dataUrl,
      fileName: safeFileName,
      firestoreSaved,
      localDiskSaved,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
