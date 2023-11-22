import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getServerSession } from 'next-auth/next';
import { Adapter } from 'next-auth/adapters';
import { updateGoogleAccount } from './prisma/account';
import { Role } from '@prisma/client';
import { isProduction } from './env-utils';

/**
 * Base scopes granted on sign up
 *
 * Additional scopes can be requested via new sign in flow
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
    ...(!isProduction()
      ? [
          CredentialsProvider({
            name: 'Credentials',
            credentials: {
              email: {
                label: 'Email',
                type: 'email',
                placeholder: 'email@email.com',
              },
              role: {
                label: 'Role',
                type: 'text',
                placeholder: 'TRAINEE',
              },
            },
            async authorize(credentials) {
              const existingUser = await prisma.user.findFirst({
                where: { email: credentials?.email },
              });
              if (existingUser) {
                return existingUser;
              }

              const user = await prisma.user.create({
                data: {
                  email: credentials?.email,
                  name: 'Test User',
                  role: credentials?.role as Role,
                },
              });

              return user;
            },
          }),
        ]
      : []),
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
