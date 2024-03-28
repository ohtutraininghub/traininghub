import React from 'react';
import CompleteProfile from '@/components/CompleteProfile';
import { getCountries } from '@/lib/prisma/country';
import { getTitles } from '@/lib/prisma/title';
import BackgroundContainer from '@/components/BackgroundContainer';
import { Locale } from '@/lib/i18n/i18n-config';

type Props = {
  params: {
    lang: Locale;
  };
};

export default async function CompleteProfilePage({ params }: Props) {
  const countries = await getCountries();
  const titles = await getTitles();

  return (
    <BackgroundContainer>
      <CompleteProfile
        countries={countries}
        titles={titles}
        lang={params.lang}
      />
    </BackgroundContainer>
  );
}
