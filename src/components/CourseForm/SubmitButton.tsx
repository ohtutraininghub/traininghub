import { useTranslation } from '@i18n/client';
import { DictProps } from '@/lib/i18n';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props extends DictProps {
  isSubmitting: boolean;
}
export default function SubmitButton({ isSubmitting, lang }: Props) {
  const { t } = useTranslation(lang, 'components');
  const { palette } = useTheme();
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      sx={{
        display: 'block',
        margin: 'auto',
        mt: 2,
        color: palette.white.main,
        backgroundColor: palette.secondary.main,
        '&:hover': {
          backgroundColor: palette.secondary.light,
        },
      }}
      data-testid="courseFormSubmit"
    >
      {t('CourseFormSubmitButton.submit')}
    </Button>
  );
}
