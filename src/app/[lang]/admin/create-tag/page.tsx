import TagForm from '@/components/TagForm';
import TagList from '@/components/TagList';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@/lib/prisma';
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
    <div
      style={{
        border: '1px solid lightGrey',
        borderRadius: '5px',
        padding: '1rem',
      }}
    >
      <Typography sx={{ marginBottom: '2rem' }} variant="h4" component="h2">
        {t('CreateTag.tagsLabel')}
      </Typography>
      <TagList lang={params.lang} tags={tags} />
      <TagForm lang={params.lang} />
    </div>
  );
}
