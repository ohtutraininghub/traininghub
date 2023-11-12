import CreateTag from './CreateTag';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@/lib/prisma';
import { useTranslation } from '@/lib/i18n';
import EditUsers from './EditUsers';
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
    <div>
      <Typography variant="h1">{t('DashboardTitle')}</Typography>
      <CreateTag
        existingTagLabel={t('CreateTag.existingTags')}
        newTagLabel={t('CreateTag.addNewTag')}
        tags={tags}
        lang={params.lang}
      />
      <EditUsers users={users} lang={params.lang} />
    </div>
  );
}
