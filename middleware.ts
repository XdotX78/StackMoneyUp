import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'it'];
const defaultLocale = 'en';

// Read maintenance mode from environment variable
// Note: In Next.js middleware, non-NEXT_PUBLIC_ env vars should be available
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true' || process.env.MAINTENANCE_MODE === '1';
const MAINTENANCE_COOKIE_NAME = 'maintenance-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read maintenance mode dynamically on each request (in case env var changes)
  const MAINTENANCE_ENABLED = process.env.MAINTENANCE_MODE === 'true' || process.env.MAINTENANCE_MODE === '1';

  // Debug: Log maintenance mode status (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Middleware] Path:', pathname, '| MAINTENANCE_MODE env:', process.env.MAINTENANCE_MODE, '| Enabled:', MAINTENANCE_ENABLED);
  }

  // Skip API routes and Next.js internal paths (but NOT maintenance page yet)
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next')) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    // Allow _next paths through
    return NextResponse.next();
  }

  // Check maintenance mode FIRST (before allowing maintenance page through)
  if (MAINTENANCE_ENABLED) {
    const maintenanceAuth = request.cookies.get(MAINTENANCE_COOKIE_NAME);
    const isMaintenancePage = pathname.includes('/maintenance');

    // If user is trying to access maintenance page, allow it
    if (isMaintenancePage) {
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

    // If not authenticated and not on maintenance page, redirect to maintenance
    if (!maintenanceAuth || maintenanceAuth.value !== 'authenticated') {
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
