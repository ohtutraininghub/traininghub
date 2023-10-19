import { prisma } from '.';

export const getTags = async () => {
  return await prisma.tag.findMany({ orderBy: { name: 'asc' } });
};
