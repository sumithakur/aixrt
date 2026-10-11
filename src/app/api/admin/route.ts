import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

  const safePath = isSafeFilePath(file);
  if (!safePath) {
    return NextResponse.json({ error: 'Invalid or disallowed file' }, { status: 400 });
  }

  try {
    const content = JSON.parse(fs.readFileSync(safePath, 'utf8'));
    return NextResponse.json({ content });
  } catch (e) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const { file, content } = await request.json();
    const safePath = isSafeFilePath(file);
    if (!safePath) {
      return NextResponse.json({ error: 'Invalid or disallowed file' }, { status: 400 });
    }

    fs.writeFileSync(safePath, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Could not save file' }, { status: 500 });
  }
}
