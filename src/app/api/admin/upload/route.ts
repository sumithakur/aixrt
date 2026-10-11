import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate extension and MIME
    const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.has(ext)) {
      return NextResponse.json(
        { error: 'Only raster images (.png, .jpg, .jpeg, .webp, .avif) are allowed' },
        { status: 400 }
      );
    }

    // Validate magic bytes
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isRiff = buffer.toString('ascii', 0, 4) === 'RIFF';
    const isFtyp = buffer.toString('ascii', 4, 8) === 'ftyp';

    if (!isPng && !isJpeg && !isRiff && !isFtyp) {
      return NextResponse.json({ error: 'Invalid image file content' }, { status: 400 });
    }

    // Save to public/brand directory with safe name
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const safeFileName = `${baseName || 'logo'}-${Date.now()}${ext}`;
    const savePath = path.join(process.cwd(), 'public', 'brand', safeFileName);
    
    fs.writeFileSync(savePath, buffer);
    
    return NextResponse.json({ success: true, url: `/brand/${safeFileName}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
