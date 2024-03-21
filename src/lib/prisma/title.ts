import { prisma } from '.';

export const getTitles = async () => {
  return await prisma.title.findMany({ orderBy: { name: 'asc' } });
};
