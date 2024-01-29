import { useState } from 'react';
import { useTranslation } from '@i18n/client';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

interface SaveTemplateButtonProps {
  isSubmitting: boolean;
  lang: 'en';
}

export default function SaveTemplateButton({
  isSubmitting,
  lang,
}: SaveTemplateButtonProps) {
  const [open, setOpen] = useState(false);
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
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
        {t('SaveTemplateButton.button.save')}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('SaveTemplateButton.confirmSave')}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {t('SaveTemplateButton.button.cancel')}
          </Button>
          <Button onClick={handleClose} color="secondary" autoFocus>
            {t('SaveTemplateButton.button.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
