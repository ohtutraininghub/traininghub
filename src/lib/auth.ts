
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({

      clientId: process.env?.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env?.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
};

