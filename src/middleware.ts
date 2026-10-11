import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('aix_admin_token')?.value;
  const isAuthenticated = token === 'aix_secure_session_token_2026';

  const isLoginPage = req.nextUrl.pathname === '/admin/login';
  const isLoginApi = req.nextUrl.pathname === '/api/admin/login';
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/admin');

  // If trying to access admin routes without auth
  if (!isAuthenticated && !isLoginPage && !isLoginApi) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // If trying to access login page but already authenticated
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
