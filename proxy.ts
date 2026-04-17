



import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';

const publicRoutes = ['/sign-in', '/sign-up'];
const authRoutes = ['/profile', '/notes'];

// Функція для точного зіставлення маршрутів
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => pathname === route || pathname.startsWith(route + '/'));
}

// Інтерфейс для опцій cookie
interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  expires?: Date;
  path?: string;
  maxAge?: number;
}


function parseCookieAttributes(cookieStr: string): { name: string; value: string; options: CookieOptions } {
  const parts = cookieStr.split(';');
  const [nameValue, ...attrParts] = parts;
  const equalIndex = nameValue.indexOf('=');
  const name = nameValue.substring(0, equalIndex);
  const value = nameValue.substring(equalIndex + 1);
  
  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  };
  
  for (const attr of attrParts) {
    const trimmedAttr = attr.trim();
    const equalPos = trimmedAttr.indexOf('=');
    let key: string;
    let val: string;
    
    if (equalPos === -1) {
      key = trimmedAttr.toLowerCase();
      val = '';
    } else {
      key = trimmedAttr.substring(0, equalPos).toLowerCase();
      val = trimmedAttr.substring(equalPos + 1);
    }
    
    switch (key) {
      case 'expires':
        options.expires = new Date(val);
        break;
      case 'path':
        options.path = val;
        break;
      case 'max-age':
        options.maxAge = parseInt(val, 10);
        break;
    }
  }
  
  return { name, value, options };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isPublicRoute = matchesRoute(pathname, publicRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);
  
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
        const { name, value, options } = parseCookieAttributes(cookieStr);
        if (name === 'accessToken') {
          response.cookies.set(name, value, options);
          accessToken = value;
        } else if (name === 'refreshToken') {
          response.cookies.set(name, value, options);
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
