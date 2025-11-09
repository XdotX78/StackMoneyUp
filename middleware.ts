// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'it', 'es'];
const defaultLocale = 'en';

const MAINTENANCE_COOKIE = 'maintenance-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Check maintenance mode from environment variable
  const isMaintenanceEnabled =
    process.env.MAINTENANCE_MODE === 'true' || process.env.MAINTENANCE_MODE === '1';

  // 1. Escludi API e file statici
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Se maintenance è attivo
  if (isMaintenanceEnabled) {
    const isOnMaintenancePage = pathname.match(/^\/(en|it|es)\/maintenance\/?$/);
    const hasAuthCookie = request.cookies.get(MAINTENANCE_COOKIE)?.value === 'authenticated';

    // 2.1 – Se l’utente NON è autenticato e NON è sulla pagina /maintenance
    if (!hasAuthCookie && !isOnMaintenancePage) {
      const locale = locales.find((lang) => pathname.startsWith(`/${lang}`)) || defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/maintenance`, request.url));
    }

    // 2.2 – Se è sulla pagina maintenance, permetti l'accesso
    if (isOnMaintenancePage) {
      return NextResponse.next();
    }
  }

  // 3. Localizzazione URL → assicurati che abbia /en o /it
  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

  if (!hasLocale) {
    const locale = defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
