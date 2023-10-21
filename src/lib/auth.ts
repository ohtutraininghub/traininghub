import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getServerSession } from 'next-auth/next';
import { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env?.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env?.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }
      return token;
    },
  },
};

export const getServerAuthSession = async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw Error('Could not find session');
  return session;
};
