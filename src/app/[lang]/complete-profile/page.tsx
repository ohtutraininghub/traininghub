import React from 'react';
import CompleteProfile from '@/components/CompleteProfile';
import { getCountries } from '@/lib/prisma/country';
import { getTitles } from '@/lib/prisma/title';
import BackgroundContainer from '@/components/BackgroundContainer';

export default async function CompleteProfilePage() {
  const countries = await getCountries();
  const titles = await getTitles();

  return (
    <BackgroundContainer>
      <CompleteProfile countries={countries} titles={titles} lang="en" />
    </BackgroundContainer>
  );
}
