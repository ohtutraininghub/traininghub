import { Button, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from '@/lib/i18n/client';
import { DictProps } from '@/lib/i18n';
import { useTheme } from '@mui/material/styles';

interface EditTemplateButtonProps extends DictProps {
  templateId: string;
}

export function EditTemplateButton({ lang }: EditTemplateButtonProps) {
  const { t } = useTranslation(lang, 'components');
  const { palette } = useTheme();

  return (
    <Box sx={{ display: 'flex', flex: 1 }}>
      <Button
        sx={{
          display: 'flex',
          alignItems: 'center',
          margin: 'auto',
          mt: 'auto',
          color: palette.white.main,
          backgroundColor: palette.secondary.main,
          '&:hover': {
            backgroundColor: palette.secondary.light,
          },
        }}
        data-testid="EditTemplateButton"
      >
        <EditIcon sx={{ mr: 1, fontSize: '25px' }} />
        {t('EditTemplateButton.button.edit')}
      </Button>
    </Box>
  );
}
