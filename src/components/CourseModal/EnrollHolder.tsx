'use client';

import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import EnrollButton from './EnrollButton';
import CancelEnroll from './CancelEnroll';
import Typography from '@mui/material/Typography';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { isPastDeadline } from '@/lib/timedateutils';
import InfoBox from './InfoBox';

interface Props extends DictProps {
  isUserEnrolled: boolean;
  courseId: string;
  isCourseFull: boolean;
  startDate: Date;
  lastEnrollDate: Date | null;
}

export default function EnrollHolder({
  isUserEnrolled,
  courseId,
  isCourseFull,
  startDate,
  lastEnrollDate,
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

  if (lastEnrollDate && isPastDeadline(new Date(), lastEnrollDate)) {
    return (
      <InfoBox
        infoText={t('EnrollHolder.pastEnrollmentDeadline')}
        Icon={BlockOutlinedIcon}
      />
    );
  }

  return <EnrollButton lang={lang} courseId={courseId} />;
}
