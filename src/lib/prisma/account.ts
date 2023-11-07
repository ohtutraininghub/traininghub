import { prisma } from '@/lib/prisma';
import { Account } from 'next-auth';

export const getRefreshToken = async (userId: string, provider: string) => {
  return await prisma.account.findFirst({
    where: { userId: userId, provider: provider },
    select: { refresh_token: true },
  });
};

export const updateGoogleAccount = async (account: Account) => {
  if (account.provider !== 'google') {
    return;
  }
  return await prisma.account.update({
    where: {
      provider_providerAccountId: {
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      },
    },
    data: {
      access_token: account.access_token,
      expires_at: account.expires_at,
      refresh_token: account.refresh_token,
      scope: account.scope,
      id_token: account.id_token,
    },
  });
};
