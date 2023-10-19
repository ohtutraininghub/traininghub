import { prisma } from '@/lib/prisma';

export const getRefreshToken = async (userId: string, provider: string) => {
  return await prisma.account.findFirst({
    where: { userId: userId, provider: provider },
    select: { refresh_token: true },
  });
};
