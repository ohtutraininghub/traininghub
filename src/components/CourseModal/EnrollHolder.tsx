import { DictProps, useTranslation } from '@/lib/i18n';
import EnrollButton from './EnrollButton';
import Typography from '@mui/material/Typography';

interface Props extends DictProps {
  isUserEnrolled: boolean;
  courseId: string;
  isCourseFull: boolean;
}

export default async function EnrollHolder({
  isUserEnrolled,
  courseId,
  isCourseFull,
  lang,
}: Props) {
  const { t } = await useTranslation(lang, 'components');
  if (isUserEnrolled) {
    return <Typography>{t('EnrollHolder.confirmMessage')}</Typography>;
  }

  if (isCourseFull) {
    return null;
  }

  return <EnrollButton lang={lang} courseId={courseId} />;
}
