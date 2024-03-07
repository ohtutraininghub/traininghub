import { DictProps } from '@/lib/i18n';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '@i18n/client';

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
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');

  return (
    <div>
      <Button
        onClick={onclick}
        disabled={isSubmitting || slackButtonDisabled}
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
    </div>
  );
};

export default CreateSlackButton;
