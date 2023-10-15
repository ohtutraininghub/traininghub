import { prisma } from './prisma';

export const getTags = async () => {
  return await prisma.tag.findMany({ orderBy: { name: 'asc' } });
};
