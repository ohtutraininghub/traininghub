import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { checkForMissingLocale, getLocale } from '@i18n/index';

const PUBLIC_FILE = /\.(.*)$/;

export default withAuth(async function middleware(req) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!token;
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  if (
    !(
      pathname.startsWith('/_next') || // exclude Next.js internals
      pathname.startsWith('/api') || // exclude all API routes
      pathname.startsWith('/static') ||
      pathname.startsWith('/public') ||
      PUBLIC_FILE.test(pathname)
    )
  ) {
    const pathnameIsMissingLocale = checkForMissingLocale(pathname);

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      const locale = getLocale(req);

      // e.g. incoming request is /products
      // The new URL is now /en/products
      return NextResponse.redirect(
        new URL(
          `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
          req.url
        )
      );
    }
  }
});
