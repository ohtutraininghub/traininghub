import { prisma } from '.';
import { Country } from '@prisma/client';

export const getCountries = async () => {
  return await prisma.country.findMany({ orderBy: { name: 'asc' } });
};

// export const getCountryById = async (countryId: Country['id']) => {
//   return await prisma.country.findFirst({
//     where: { id: countryId },
//   });
// };

export const getCountryById = async (countryId: Country['id']) => {
  return await prisma.country.findFirst({
    where: {
      id: countryId,
    },
  });
};
