import { prisma } from '.';
import { Prisma } from '@prisma/client';

export const getTitles = async () => {
  return await prisma.title.findMany({ orderBy: { name: 'asc' } });
};

export type Titles = Prisma.PromiseReturnType<typeof getTitles>;
