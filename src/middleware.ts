import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { Role } from '@prisma/client';
import { NextResponse } from 'next/server';

export default withAuth(async function middleware(req) {
  const token = await getToken({ req });

  const isAuthenticated = !!token;
  if (!isAuthenticated) {
    return NextResponse.redirect('/login');
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
});

export const config = {
  matcher: ['/(.*)'],
};
