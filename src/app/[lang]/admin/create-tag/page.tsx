import TagForm from '@/components/TagForm';
import TagList from '@/components/TagList';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@/lib/prisma/prisma';
import Typography from '@mui/material/Typography';
import { useTranslation } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

interface Props {
  params: { lang: Locale };
}

export default async function CreateTag({ params }: Props) {
  const { t } = await useTranslation(params.lang, 'admin');
  const tags = await prisma.tag.findMany({
    orderBy: [{ name: 'asc' }],
  });

  return (
    <>
      <Typography variant="h3" component="h1">
        {t('CreateTag.addNewTag')}
      </Typography>
      <TagForm lang={params.lang} />
      <Typography variant="h5" component="h2">
        {t('CreateTag.existingTags')}
      </Typography>
      <TagList lang={params.lang} tags={tags} />
    </>
  );
}
