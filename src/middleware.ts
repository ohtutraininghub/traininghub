import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse, NextFetchEvent, NextRequest } from 'next/server';
import { checkForMissingLocale } from '@i18n/index';
import { cookies } from 'next/headers';
import { i18n } from './lib/i18n/i18n-config';
import { NextRequestWithAuth } from 'next-auth/middleware';

const PUBLIC_FILE = /\.(.*)$/;

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/reminder')) {
    return NextResponse.next();
  }
  return withAuthResult(req as NextRequestWithAuth, event);
}

const withAuthResult = withAuth(async function middleware(req) {
  const token = await getToken({ req });
  const { pathname, search } = req.nextUrl;

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
      pathname.startsWith('/monitoring') || // exclude sentry tunnel route
      pathname.startsWith('/complete-profile') ||
      PUBLIC_FILE.test(pathname)
    )
  ) {
    const nextLocale = cookies().get('NEXT_LOCALE');
    const locale = nextLocale?.value ?? i18n.defaultLocale;

    const pathnameIsMissingLocale = checkForMissingLocale(pathname);
    // Redirect to complete profile if user is authenticated but profile is not completed
    if (
      isAuthenticated &&
      !token.profileCompleted &&
      !pathname.includes('/complete-profile')
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}/complete-profile`, req.url)
      );
    }
    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      // e.g. incoming request is /products
      // The new URL is now /en/products
      const response = NextResponse.redirect(
        new URL(
          `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${
            search ? `${search}` : ''
          }`,
          req.url
        )
      );
      response.cookies.set('NEXT_LOCALE', locale);
      return response;
    }

    const pathnameHasWrongLocale = !pathname.startsWith(`/${locale}`);
    // Redirect if the url path locale is different than NEXT_LOCALE cookie value
    if (pathnameHasWrongLocale) {
      const selectedLocale =
        i18n.locales.find((locale) => pathname.startsWith(`/${locale}`)) ?? '';
      const newPath = pathname.replace(selectedLocale, '');
      const response = NextResponse.redirect(
        new URL(
          `/${locale}${newPath.startsWith('/') ? '' : '/'}${newPath}${
            search ? `${search}` : ''
          }`,
          req.url
        )
      );
      response.cookies.set('NEXT_LOCALE', locale);
      return response;
    }
  }
});
