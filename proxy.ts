


import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/sign-in', '/sign-up'];
const authRoutes = ['/profile', '/notes'];
const apiPublicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/session', '/api/auth/logout'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // API публічні маршрути — пропускаємо без перевірки
  const isApiPublicRoute = apiPublicRoutes.some(route => pathname === route || pathname.startsWith(route));
  if (isApiPublicRoute) {
    return NextResponse.next();
  }
  
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route));

  // Проверяем наличие accessToken
  const accessToken = request.cookies.get('accessToken');
  
  // ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА: если токен есть, но он пустой или expired - считаем что нет
  const isValidToken = accessToken && accessToken.value && accessToken.value.length > 0;

  // Приватный маршрут без токена → на логин
  if (isAuthRoute && !isValidToken) {
   
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Публичный маршрут с токеном → на профиль
  if (isPublicRoute && isValidToken) {
   
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};