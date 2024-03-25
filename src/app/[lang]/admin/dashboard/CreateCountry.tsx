import CountryForm from '@/components/CountryForm';
import CountryList from '@/components/CountryList';
import Typography from '@mui/material/Typography';
import { DictProps } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

type Country = {
  id: string;
  name: string | null;
  countryCode: string | null;
};

interface Props extends DictProps {
  countryHeader: string;
  countries: Country[];
}

export default function CreateCountry({
  lang,
  countryHeader,
  countries,
}: Props) {
  return (
    <div
      style={{
        border: '1px solid lightGrey',
        borderRadius: '5px',
        padding: '1rem',
      }}
    >
      <Typography variant="h2" sx={{ marginBottom: '2rem' }}>
        {countryHeader}
      </Typography>
      <CountryList lang={lang} countries={countries} />
      <CountryForm lang={lang} />
    </div>
  );
}
