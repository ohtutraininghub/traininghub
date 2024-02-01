import { useTranslation } from '@i18n/client';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { DictProps } from '@/lib/i18n';

interface SaveTemplateButtonProps extends DictProps {
  isSubmitting: boolean;
  handleDialogOpen: () => void;
  dialogOpen: boolean;
}

export default function SaveTemplateButton({
  isSubmitting,
  lang,
  handleDialogOpen,
  dialogOpen,
}: SaveTemplateButtonProps) {
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');

  return (
    <>
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
      <Dialog
        open={dialogOpen}
        onClose={handleDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('SaveTemplateButton.confirmSave')}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogOpen} color="secondary">
            {t('SaveTemplateButton.button.cancel')}
          </Button>
          <Button onClick={handleDialogOpen} color="secondary" autoFocus>
            {t('SaveTemplateButton.button.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
