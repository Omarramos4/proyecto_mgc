import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Middleware simplificado para evitar problemas de validación
 */
export async function middleware(request) {
  const protectedRoutes = ['/sgc/inicio', '/sgc/coberturas', '/sgc/configs', '/sgc/recursohumano', '/sgc/reportes', '/sgc/dashboard'];
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  // Si intenta acceder a rutas protegidas sin token
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!token || !token.value) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Si intenta acceder a login con token válido, redirigir a inicio
  if (request.nextUrl.pathname === '/login' && token && token.value) {
    return NextResponse.redirect(new URL('/sgc/inicio', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|hm_bg.jpg|HM_Logo.png).*)',
  ],
};
