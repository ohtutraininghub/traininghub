import CreateTag from './CreateTag';
import CreateCountry from './CreateCountry';
import CreateTitle from './CreateTitle';
import { Locale } from '@/lib/i18n/i18n-config';
import { translator } from '@/lib/i18n';
import UserList from '@/components/UserList';
import { Typography } from '@mui/material';
import { getAllUsers } from '@/lib/prisma/users';
import { getTags } from '@/lib/prisma/tags';
import { getCountries } from '@/lib/prisma/country';
import { getTitles } from '@/lib/prisma/title';

export const dynamic = 'force-dynamic';

interface Props {
  params: { lang: Locale };
}

export default async function AdminDashboardPage({ params }: Props) {
  const { t } = await translator('admin');
  const tags = await getTags();
  const countries = await getCountries();
  const titles = await getTitles();
  const users = await getAllUsers();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h1">{t('DashboardTitle')}</Typography>
      <CreateTitle
        titlesHeader={t('TitlesSection.header')}
        titles={titles}
        lang={params.lang}
      />
      <CreateCountry
        countryHeader={t('CountriesSection.header')}
        countries={countries}
        lang={params.lang}
      />
      <CreateTag
        tagsHeader={t('TagsSection.header')}
        tags={tags}
        lang={params.lang}
      />
      <UserList
        users={users}
        lang={params.lang}
        countries={countries}
        titles={titles}
      />
    </div>
  );
}
