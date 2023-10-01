import { NextResponse } from 'next/server';
import { checkForMissingLocale, getLocale } from '@i18n/i18n';
import { withAuth } from 'next-auth/middleware';

export default withAuth(function middleware(request) {
  const { pathname } = request.nextUrl;
  if (
    !(
      (
        pathname.startsWith('/_next') || // exclude Next.js internals
        pathname.startsWith('/api') || // exclude all API routes
        pathname.startsWith('/static')
      ) // exclude static files
    )
  ) {
    const pathnameIsMissingLocale = checkForMissingLocale(pathname);

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      const locale = getLocale(request);

      // e.g. incoming request is /products
      // The new URL is now /en/products
      return NextResponse.redirect(
        new URL(
          `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
          request.url
        )
      );
    }
  }
});
