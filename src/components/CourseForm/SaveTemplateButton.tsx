import { useTranslation } from '@i18n/client';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DictProps } from '@/lib/i18n';
import { ConfirmCard } from '../ConfirmCard';

interface SaveTemplateButtonProps extends DictProps {
  isSubmitting: boolean;
  handleDialogOpen: () => void;
  handleSaveTemplate: () => void;
  dialogOpen: boolean;
}

export default function SaveTemplateButton({
  isSubmitting,
  lang,
  handleDialogOpen,
  handleSaveTemplate,
  dialogOpen,
}: SaveTemplateButtonProps) {
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');

  return (
    <div>
      <Button
        onClick={handleDialogOpen}
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
        data-testid="saveTemplateButton"
      >
        {t('SaveTemplateButton.button.save')}
      </Button>
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <ConfirmCard
          lang={lang}
          backdropOpen={dialogOpen}
          setBackdropOpen={handleDialogOpen}
          confirmMessage={t('SaveTemplateButton.confirmSave')}
          handleClick={handleSaveTemplate}
          includeCheckbox={false}
        />
      </Box>
    </div>
  );
}
