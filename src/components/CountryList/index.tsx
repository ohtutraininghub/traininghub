import { Prisma } from '@prisma/client';
import { Typography } from '@mui/material';
import { DictProps, translator } from '@/lib/i18n';
import CountryChip from './CountryChip';

type CountryPrismaType = Prisma.CountryGetPayload<Prisma.CountryDefaultArgs>;

interface CountryListProps extends DictProps {
  countries: CountryPrismaType[];
}

export default async function CountyList({
  lang,
  countries,
}: CountryListProps) {
  const { t } = await translator('admin');

  if (countries.length === 0) {
    return (
      <Typography variant="body1" mt={1}>
        {`(${t('CountryList.noCountriesAdded')})`}
      </Typography>
    );
  }

  return (
    <ul
      data-testid="country-list"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        padding: 0,
      }}
    >
      {countries.map((country) => (
        <li
          key={country.name}
          style={{
            display: 'inline',
            margin: '0 0.5em 1.2em 0',
          }}
        >
          <CountryChip
            lang={lang}
            countryId={country.id}
            countryName={country.name}
          />
        </li>
      ))}
    </ul>
  );
}
