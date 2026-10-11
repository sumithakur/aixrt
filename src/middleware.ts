import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionTokenEdge } from '@/lib/edge-auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('aix_admin_token')?.value;
  const isAuthenticated = await verifySessionTokenEdge(token);

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
