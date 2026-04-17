
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';
import { parse } from 'cookie';

const publicRoutes = ['/sign-in', '/sign-up'];
const authRoutes = ['/profile', '/notes'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route));
  
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  
  // Поновлення сесії через checkSession
  if (!accessToken && refreshToken) {
    const sessionResponse = await checkSession();
    const setCookieHeader = sessionResponse?.headers['set-cookie'];
    
    if (setCookieHeader) {
      const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      const response = NextResponse.next();
      
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);
        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path || '/',
          maxAge: Number(parsed['Max-Age']),
          httpOnly: true,
          secure: true,
          sameSite: 'lax' as const,
        };
        if (parsed.accessToken) {
          response.cookies.set('accessToken', parsed.accessToken, options);
          accessToken = parsed.accessToken;
        }
        if (parsed.refreshToken) {
          response.cookies.set('refreshToken', parsed.refreshToken, options);
        }
      }
      if (accessToken) return response;
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
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
