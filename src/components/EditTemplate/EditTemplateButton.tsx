import { Button, Box, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from '@/lib/i18n/client';
import { DictProps } from '@/lib/i18n';
import { useTheme } from '@mui/material/styles';

interface EditTemplateButtonProps extends DictProps {
  templateId: string;
  onClick: () => void;
}

export function EditTemplateButton({ lang, onClick }: EditTemplateButtonProps) {
  const { t } = useTranslation(lang, 'components');
  const { palette } = useTheme();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flex: 1 }}>
      <Button
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          margin: 'auto',
          padding: isSmallScreen ? '5px' : 'auto',
          mt: 'auto',
          color: palette.white.main,
          backgroundColor: palette.secondary.main,
          '&:hover': {
            backgroundColor: palette.secondary.light,
          },
        }}
        data-testid="EditTemplateButton"
      >
        <EditIcon sx={{ mr: isSmallScreen ? 0 : 1, fontSize: '22px' }} />
        {!isSmallScreen && t('EditTemplate.button.edit')}
      </Button>
    </Box>
  );
}
