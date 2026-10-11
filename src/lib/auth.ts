import crypto from 'crypto';

const AUTH_SECRET = process.env.ADMIN_AUTH_SECRET || 'aix_summit_2026_super_secure_auth_secret_key_981247';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aix2026';

export function verifyAdminCredentials(user: string, pass: string): boolean {
  if (!user || !pass) return false;
  return user === ADMIN_USERNAME && pass === ADMIN_PASSWORD;
}

export function generateSessionToken(): string {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(16).toString('hex');
  const payload = `${timestamp}.${random}`;
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [timestampStr, random, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Session expiry: 7 days
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAge) return false;

  const payload = `${timestampStr}.${random}`;
  const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
  } catch (e) {
    return false;
  }
}
