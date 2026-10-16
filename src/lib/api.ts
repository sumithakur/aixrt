/**
 * Thin client for the AIXRT backend (aixrt_backend).
 * Every endpoint responds with { success, data } or { success: false, error: { code, msg } }.
 */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aixrt.be.aixroundtables.com/api').replace(/\/+$/, '');

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code?: number; msg?: string };
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers },
    });
  } catch {
    throw new Error('Unable to reach the server. Please try again shortly.');
  }

  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok || !body?.success) {
    throw new Error(body?.error?.msg || `Request failed (${res.status})`);
  }
  return body.data as T;
}
