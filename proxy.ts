



import { NextRequest, NextResponse } from 'next/server';

import { api } from './app/api/api';

const publicRoutes = ['/sign-in', '/sign-up'];
const authRoutes = ['/profile', '/notes'];
const apiPublicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/session'];

async function refreshSession(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isApiPublicRoute = apiPublicRoutes.some(route => pathname === route || pathname.startsWith(route));
  if (isApiPublicRoute) {
    return NextResponse.next();
  }
  
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route));
  
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  
  if (!accessToken && refreshToken && isAuthRoute) {
    const newTokens = await refreshSession(refreshToken);
    if (newTokens) {
      const response = NextResponse.next();
      response.cookies.set('accessToken', newTokens.accessToken, { httpOnly: true, secure: true, sameSite: 'lax' });
      response.cookies.set('refreshToken', newTokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'lax' });
      return response;
    }
  }
  
  if (!accessToken && !refreshToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
