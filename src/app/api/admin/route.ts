import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { loadContentFile } from '@/lib/content';

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
    const content = loadContentFile(file);
    return NextResponse.json({ content });
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

    // 1. Update in-memory global cache
    if (typeof globalThis !== 'undefined') {
      globalThis.__CMS_CACHE__ = globalThis.__CMS_CACHE__ || {};
      globalThis.__CMS_CACHE__[file] = content;
    }

    // 2. Try writing to /tmp/content (writable on Vercel and serverless containers)
    try {
      const tmpDir = path.join('/tmp', 'content');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      fs.writeFileSync(path.join(tmpDir, file), JSON.stringify(content, null, 2), 'utf8');
    } catch (tmpErr) {
      console.warn('Could not write to /tmp:', tmpErr);
    }

    // 3. Try writing to local content directory on disk (succeeds locally & Node environments)
    try {
      fs.writeFileSync(safePath, JSON.stringify(content, null, 2), 'utf8');
    } catch (fsErr) {
      // In read-only environments like Vercel Lambda, this will throw EROFS. That's expected,
      // as we already saved to global cache and /tmp!
      console.warn('Filesystem read-only (e.g. Vercel), saved to memory & /tmp instead.');
    }

    // 4. If GITHUB_TOKEN is configured in Vercel environment variables, commit directly to GitHub repository!
    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = process.env.GITHUB_REPO_OWNER || 'sumithakur';
    const repoName = process.env.GITHUB_REPO_NAME || 'aixrt';
    let gitSyncStatus = 'local_only';

    if (githubToken) {
      try {
        const filePath = `content/${file}`;
        const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
        
        // Get existing file SHA
        const getRes = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        let sha: string | undefined = undefined;
        if (getRes.ok) {
          const fileInfo = await getRes.json();
          sha = fileInfo.sha;
        }

        // Commit updated file to GitHub
        const fileContentBase64 = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
        const putRes = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `chore(cms): update ${file} via Content Manager`,
            content: fileContentBase64,
            sha,
          }),
        });

        if (putRes.ok) {
          gitSyncStatus = 'committed_to_github';
        } else {
          console.warn('GitHub API commit returned error:', await putRes.text());
        }
      } catch (ghErr) {
        console.warn('Failed to sync to GitHub:', ghErr);
      }
    }

    // 5. Force on-demand revalidation across the app so all pages re-render with the latest content
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
      gitSyncStatus,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Could not save file' }, { status: 500 });
  }
}
