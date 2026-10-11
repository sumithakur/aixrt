import { NextResponse } from 'next/server';
import { verifyAdminCredentials, generateSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (verifyAdminCredentials(username, password)) {
      const response = NextResponse.json({ success: true });
      const token = generateSessionToken();
      
      // Set a secure, HTTP-only cookie with expiring HMAC token
      response.cookies.set({
        name: 'aix_admin_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Bad request' },
      { status: 400 }
    );
  }
}
