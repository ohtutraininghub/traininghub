import { DictProps } from '@/lib/i18n';
import { Button, Tooltip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '@i18n/client';
import theme from '../Providers/ThemeRegistry/theme';
import Image from 'next/image';

interface CreateSlackButtonProps extends DictProps {
  onclick: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
      <Tooltip
        title={t('AddSlackButton.tooltip')}
        enterTouchDelay={0}
        followCursor={true}
        arrow={true}
        leaveTouchDelay={500}
      >
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
          data-testid="createSlackButton"
        >
          <Image
            style={{ marginRight: isSmallScreen ? 0 : '0.5em' }}
            src="/slack-logo-png-white.png"
            width={22}
            height={22}
            alt="Slack"
          />
          {!isSmallScreen && t('AddSlackButton.button.add')}
        </Button>
      </Tooltip>
    </div>
  );
};

export default CreateSlackButton;
