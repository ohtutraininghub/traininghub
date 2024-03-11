import { useTranslation } from '@i18n/client';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DictProps } from '@/lib/i18n';
import { ConfirmCard } from '../ConfirmCard';

interface EditButtonProps extends DictProps {
  isSubmitting: boolean;
  handleDialogOpen: () => void;
  handleEdit: () => void;
  dialogOpen: boolean;
}

export default function EditButton({
  isSubmitting,
  lang,
  handleDialogOpen,
  handleEdit,
  dialogOpen,
}: EditButtonProps) {
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
        data-testid="editButton"
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
          handleClick={handleEdit}
        />
      </Box>
    </div>
  );
}
