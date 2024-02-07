import { Button, Box, useMediaQuery } from '@mui/material';
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
        <EditIcon sx={{ mr: 1, fontSize: '22px' }} />
        {!isSmallScreen && t('EditTemplateButton.button.edit')}
      </Button>
    </Box>
  );
}
