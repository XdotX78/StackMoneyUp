import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'it'];
const defaultLocale = 'en';

const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true';
const MAINTENANCE_COOKIE_NAME = 'maintenance-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip maintenance check for API routes and Next.js internal paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.includes('maintenance')
  ) {
    // For API routes, continue without locale check
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    // For maintenance page, handle locale normally
    if (pathname.includes('/maintenance')) {
      // Check if pathname has locale for maintenance page
      const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/maintenance`) || pathname === `/${locale}/maintenance`
      );
      
      if (pathnameHasLocale) {
        return NextResponse.next();
      }
      
      // Redirect to default locale maintenance page
      const locale = defaultLocale;
      request.nextUrl.pathname = `/${locale}/maintenance`;
      return NextResponse.redirect(request.nextUrl);
    }
  }

  // Check maintenance mode
  if (MAINTENANCE_MODE) {
    const maintenanceAuth = request.cookies.get(MAINTENANCE_COOKIE_NAME);
    
    // If not authenticated, redirect to maintenance page
    if (!maintenanceAuth || maintenanceAuth.value !== 'authenticated') {
      // Don't redirect if already on maintenance page
      if (!pathname.includes('/maintenance')) {
        // Determine locale from pathname or use default
        let locale = defaultLocale;
        const pathnameHasLocale = locales.some(
          (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
        );
        if (pathnameHasLocale) {
          const matchedLocale = locales.find(
            (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
          );
          if (matchedLocale) locale = matchedLocale;
        }
        const maintenanceUrl = new URL(`/${locale}/maintenance`, request.url);
        // Preserve query parameters if any
        maintenanceUrl.search = request.nextUrl.search;
        return NextResponse.redirect(maintenanceUrl);
      }
    }
  }

  // Check if pathname is missing locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to default locale if none specified
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
};
