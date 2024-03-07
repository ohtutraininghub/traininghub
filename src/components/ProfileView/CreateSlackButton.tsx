import { DictProps } from '@/lib/i18n';
import { Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '@i18n/client';
import theme from '../Providers/ThemeRegistry/theme';

interface CreateSlackButtonProps extends DictProps {
  onclick: () => void;
  isSubmitting: boolean;
  slackButtonDisabled: boolean;
}

const CreateSlackButton = ({
  lang,
  onclick,
  isSubmitting,
  slackButtonDisabled,
}: CreateSlackButtonProps) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');

  return (
    <div>
      <Button
        onClick={onclick}
        disabled={isSubmitting || slackButtonDisabled}
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
        data-testid="saveTemplateButton"
      >
        {t('AddSlackButton.button.add')}
      </Button>
    </div>
  );
};

export default CreateSlackButton;
