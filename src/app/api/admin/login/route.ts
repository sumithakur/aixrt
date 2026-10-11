import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Hardcoded credentials
    if (username === 'admin' && password === 'aix2026') {
      const response = NextResponse.json({ success: true });
      
      // Set a secure, HTTP-only cookie
      response.cookies.set({
        name: 'aix_admin_token',
        value: 'aix_secure_session_token_2026',
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
