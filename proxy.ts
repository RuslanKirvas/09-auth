
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';

const publicRoutes = ['/sign-in', '/sign-up'];
const authRoutes = ['/profile', '/notes'];
const apiPublicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/session'];

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
  const refreshToken = cookieStore.get('refreshToken')?.value;
  
  // Поновлення сесії через checkSession з serverApi
  if (!accessToken && refreshToken) {
    const sessionResponse = await checkSession();
    if (sessionResponse && sessionResponse.data) {
      // Отримуємо нові токени з відповіді
      const newAccessToken = cookieStore.get('accessToken')?.value;
      const newRefreshToken = cookieStore.get('refreshToken')?.value;
      
      if (newAccessToken) {
        accessToken = newAccessToken;
        const response = NextResponse.next();
        if (newRefreshToken) {
          response.cookies.set('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'lax' });
        }
        return response;
      }
    }
  }
  

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
