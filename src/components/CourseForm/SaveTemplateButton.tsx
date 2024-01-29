import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '@i18n/client';

interface SaveTemplateButtonProps {
  isSubmitting: boolean;
  lang: 'en';
}
export default function SaveTemplateButton({
  isSubmitting,
  lang,
}: SaveTemplateButtonProps) {
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');
  return (
    <Button
      onClick={() => {
        alert('clicked');
      }}
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
    >
      {t('SaveTemplateButton.saveButton')}
    </Button>
  );
}
