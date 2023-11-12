import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getServerSession } from 'next-auth/next';
import { Adapter } from 'next-auth/adapters';
import { updateGoogleAccount } from './prisma/account';
import { Role } from '@prisma/client';

const scopes =
  'openid ' +
  'https://www.googleapis.com/auth/userinfo.email ' +
  'https://www.googleapis.com/auth/userinfo.profile ' +
  'https://www.googleapis.com/auth/calendar.events.owned ';

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
        },
      },
    }),
    ...(process.env.NODE_ENV !== 'production'
      ? [
          CredentialsProvider({
            name: 'Credentials',
            credentials: {
              email: {
                label: 'Email',
                type: 'email',
                placeholder: 'email@email.com',
              },
            },
            async authorize(credentials) {
              const existingUser = await prisma.user.findFirst({
                where: { email: credentials?.email },
              });
              const user =
                existingUser ??
                (await prisma.user.create({
                  data: {
                    email: credentials?.email,
                    name: 'Test User',
                    role: Role.TRAINER,
                  },
                }));

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
