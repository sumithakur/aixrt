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

    // Save to public/brand directory
    const fileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const savePath = path.join(process.cwd(), 'public', 'brand', fileName);
    
    fs.writeFileSync(savePath, buffer);
    
    return NextResponse.json({ success: true, url: `/brand/${fileName}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
