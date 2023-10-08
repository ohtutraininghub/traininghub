import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env?.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env?.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
};
