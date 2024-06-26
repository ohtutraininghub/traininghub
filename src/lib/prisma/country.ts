import { prisma } from '.';
import { Country, Prisma } from '@prisma/client';

export const getCountries = async () => {
  return await prisma.country.findMany({ orderBy: { name: 'asc' } });
};

export const getCountryById = async (countryId: Country['id']) => {
  return await prisma.country.findFirst({
    where: {
      id: countryId,
    },
  });
};

export type Countries = Prisma.PromiseReturnType<typeof getCountries>;
