import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (file) {
    try {
      const filePath = path.join(contentDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return NextResponse.json({ content });
    } catch (e) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  }
  return NextResponse.json({ error: 'No file specified' }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const { file, content } = await request.json();
    if (!file || !file.endsWith('.json')) {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }
    const filePath = path.join(contentDir, file);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Could not save file' }, { status: 500 });
  }
}
