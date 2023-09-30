import { Typography } from '@mui/material';
import { Locale } from '@i18n/i18n-config';
import { getDictionary } from '@i18n/dictionaries';

type HomePageProps = {
  params: {
    lang: Locale;
  };
};

export default async function HomePage({ params: { lang } }: HomePageProps) {
  const dict = await getDictionary(lang);
  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Typography>{dict.index.trainingListTitle}</Typography>
    </main>
  );
}
