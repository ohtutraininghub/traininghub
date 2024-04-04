import { DictProps } from '@/lib/i18n';
import { Button, Tooltip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '@i18n/client';
import theme from '../Providers/ThemeRegistry/theme';
import Image from 'next/image';

interface CreateFeedbackButtonProps extends DictProps {
  onclick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonDisabled: boolean;
}

const CreateFeedbackButton = ({
  lang,
  onclick,
  buttonDisabled,
}: CreateFeedbackButtonProps) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');
  const tooltipText = buttonDisabled
    ? t('CreateFeedbackButton.tooltip.disabled')
    : t('CreateFeedbackButton.tooltip.active');
  return (
    <div>
      <Tooltip
        title={tooltipText}
        enterTouchDelay={0}
        followCursor={true}
        arrow={true}
        leaveTouchDelay={500}
      >
        <span>
          <Button
            onClick={onclick}
            disabled={buttonDisabled}
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
              '& img': {
                opacity: buttonDisabled ? 0.5 : 1,
              },
            }}
            data-testid="createFeedbackButton"
          >
            <Image
              style={{ marginRight: isSmallScreen ? 0 : '0.5em' }}
              src="/Google_Forms.png"
              width={16}
              height={22}
              alt="Google Forms logo"
            />
            {!isSmallScreen && t('CreateFeedbackButton.button')}
          </Button>
        </span>
      </Tooltip>
    </div>
  );
};

export default CreateFeedbackButton;
