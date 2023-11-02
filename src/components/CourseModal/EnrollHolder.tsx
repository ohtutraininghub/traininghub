'use client';

import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import EnrollButton from './EnrollButton';
import CancelEnroll from './CancelEnroll';
import Typography from '@mui/material/Typography';

interface Props extends DictProps {
  isUserEnrolled: boolean;
  courseId: string;
  isCourseFull: boolean;
  startDate: Date;
}

export default function EnrollHolder({
  isUserEnrolled,
  courseId,
  isCourseFull,
  startDate,
  lang,
}: Props) {
  const { t } = useTranslation(lang, 'components');
  if (isUserEnrolled) {
    return (
      <>
        <Typography>{t('EnrollHolder.confirmMessage')}</Typography>
        <CancelEnroll courseId={courseId} startDate={startDate} lang={lang} />
      </>
    );
  }

  if (isCourseFull) {
    return null;
  }

  return <EnrollButton lang={lang} courseId={courseId} />;
}
