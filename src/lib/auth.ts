import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getServerSession } from 'next-auth/next';
import { Adapter } from 'next-auth/adapters';
import { updateGoogleAccount } from './prisma/account';

/**
 * Base scopes granted on sign up
 *
 * Additional scopes can be requested via
 */
const scopes =
  'openid ' +
  'https://www.googleapis.com/auth/userinfo.email ' +
  'https://www.googleapis.com/auth/userinfo.profile';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
          scope: scopes,
          include_granted_scopes: true,
        },
      },
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
    jwt: async ({ token, user, account }) => {
      if (account) {
        // Account is only provided on first call right after sign in
        await updateGoogleAccount(account);
      }

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
