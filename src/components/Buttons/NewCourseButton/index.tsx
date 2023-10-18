'use client';

import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import { Button, Typography } from '@mui/material';
import Link from 'next/link';

interface Props extends DictProps {}

export default function NewCourseButton({ lang }: Props) {
  const { t } = useTranslation(lang, 'components');
  return (
    <>
      <Typography variant="h4">{t('NewCourseButton.actions')}</Typography>
      <Link href="/courses/create">
        <Button variant="contained" sx={{ m: 1 }}>
          {t('NewCourseButton.newCourse')}
        </Button>
      </Link>
    </>
  );
}
