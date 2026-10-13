/**
 * Save a remote file to the user's device without navigating away.
 * Tries a blob download first (needs CORS on the file host); if that fails,
 * falls back to `fallbackUrl`, which should respond with Content-Disposition: attachment.
 */
export async function downloadFile(url: string, fileName: string, fallbackUrl?: string): Promise<void> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Download failed (${res.status})`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerAnchor(objectUrl, fileName);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
  } catch {
    triggerAnchor(fallbackUrl || url, fileName, !fallbackUrl);
  }
}

function triggerAnchor(href: string, fileName: string, newTab = false) {
  const a = document.createElement('a');
  a.href = href;
  a.download = fileName;
  if (newTab) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  document.body.appendChild(a);
  a.click();
  a.remove();
}
