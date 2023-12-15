import CreateTag from './CreateTag';
import { Locale } from '@/lib/i18n/i18n-config';
import { translator } from '@/lib/i18n';
import UserList from '@/components/UserList';
import { Typography } from '@mui/material';
import { getAllUsers } from '@/lib/prisma/users';
import { getTags } from '@/lib/prisma/tags';

export const dynamic = 'force-dynamic';

interface Props {
  params: { lang: Locale };
}

export default async function AdminDashboardPage({ params }: Props) {
  const { t } = await translator('admin');
  const tags = await getTags();

  const users = await getAllUsers();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h1">{t('DashboardTitle')}</Typography>
      <CreateTag
        tagsHeader={t('TagsSection.header')}
        tags={tags}
        lang={params.lang}
      />
      <UserList users={users} lang={params.lang} />
    </div>
  );
}
