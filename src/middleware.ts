import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';
import { checkForMissingLocale, getLocale } from '@i18n/index';

const PUBLIC_FILE = /\.(.*)$/;

export default withAuth(async function middleware(req) {
  const token = await getToken({ req });

  const isAuthenticated = !!token;
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  const isAdmin = token.role === Role.ADMIN;
  const isTrainerOrAdmin =
    token.role === Role.TRAINER || token.role === Role.ADMIN;

  // Admin only paths
  if (!isAdmin && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Trainer and Admin paths
  if (!isTrainerOrAdmin && req.nextUrl.pathname.startsWith('/course')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const { pathname } = req.nextUrl;

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

// Match all routes
export const config = {
  matcher: ['/(.*)'],
};
