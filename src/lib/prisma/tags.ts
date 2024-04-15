import { prisma } from '.';
import { Prisma } from '@prisma/client';

export const getTags = async () => {
  return await prisma.tag.findMany({ orderBy: { name: 'asc' } });
};

export type Tags = Prisma.PromiseReturnType<typeof getTags>;
