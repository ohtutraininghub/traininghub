import CreateTag from './CreateTag';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@/lib/prisma';
import { useTranslation } from '@/lib/i18n';
import UserList from '@/components/UserList';
import { Typography } from '@mui/material';
import { getAllUsers } from '@/lib/prisma/users';

interface Props {
  params: { lang: Locale };
}

export default async function AdminDashboardPage({ params }: Props) {
  const { t } = await useTranslation(params.lang, 'admin');
  const tags = await prisma.tag.findMany({
    orderBy: [{ name: 'asc' }],
  });

  const users = await getAllUsers();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h3" component="h1">
        {t('DashboardTitle')}
      </Typography>
      <CreateTag
        existingTagLabel={t('CreateTag.tagsLabel')}
        tags={tags}
        lang={params.lang}
      />
      <UserList users={users} lang={params.lang} />
    </div>
  );
}
