import { prisma } from '.';

export const getCountries = async () => {
  return await prisma.country.findMany({ orderBy: { name: 'asc' } });
};
