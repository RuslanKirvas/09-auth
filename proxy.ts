


import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
  
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value;
  let refreshToken = cookieStore.get('refreshToken')?.value;
  
  // Поновлення сесії для будь-якого маршруту (не тільки приватного)
  // якщо немає accessToken, але є refreshToken
  if (!accessToken && refreshToken) {
    const newTokens = await refreshSession(refreshToken);
    if (newTokens) {
      accessToken = newTokens.accessToken;
      refreshToken = newTokens.refreshToken;
      const response = NextResponse.next();
      response.cookies.set('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'lax' });
      response.cookies.set('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'lax' });
      return response;
    }
  }
  
  // Якщо є accessToken, але користувач на публічному маршруті
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Якщо немає токенів і маршрут приватний
  if (!accessToken && !refreshToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  // Явний дозвіл для неавторизованих користувачів на публічні маршрути
  if (!accessToken && !refreshToken && isPublicRoute) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
