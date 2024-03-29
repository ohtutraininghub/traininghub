import { useTranslation } from '@i18n/client';
import { DictProps } from '@/lib/i18n';
import { ConfirmCard } from '../ConfirmCard';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface EditButtonProps extends DictProps {
  isSubmitting: boolean;
  handleDialogOpen: () => void;
  handleEdit: () => void;
  dialogOpen: boolean;
  onNotifyChange?: (isChecked: boolean) => void;
}

export default function EditButton({
  isSubmitting,
  lang,
  handleDialogOpen,
  handleEdit,
  dialogOpen,
  onNotifyChange,
}: EditButtonProps) {
  const { t } = useTranslation(lang, 'components');
  const { palette } = useTheme();

  const handleConfirm = () => {
    handleEdit();
  };

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
        data-testid="courseFormEdit"
      >
        {t('CourseFormEditButton.update')}
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
          confirmMessage={t('CourseFormEditButton.confirmEdit')}
          handleClick={handleConfirm}
          includeCheckbox={true}
          onNotifyChange={onNotifyChange}
        />
      </Box>
    </div>
  );
}
