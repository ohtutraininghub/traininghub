'use client';

import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import { StorageType, setItem } from '@/lib/storage';
import { useState } from 'react';
import { post } from '@/lib/response/fetchUtil';
import {
  Backdrop,
  Box,
  Button,
  Card,
  Typography,
  Checkbox,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CALENDAR_SCOPE } from '@/lib/google/constants';
import { signIn } from 'next-auth/react';

interface Props extends DictProps {
  open: boolean;
  hideBackdrop: () => void;
  hasPermissions: boolean;
  courseId: string;
}

export function CalendarPrompt({
  open,
  hideBackdrop,
  hasPermissions,
  courseId,
  lang,
}: Props) {
  const { t } = useTranslation(lang, 'components');
  const { palette } = useTheme();
  const [rememberMyDecision, setRememberMyDecision] = useState(false);

  const handleYesClick = async () => {
    if (rememberMyDecision) {
      setItem(StorageType.INSERT_TO_CALENDAR, true);
    }

    if (!hasPermissions) {
      // If no permissions, trigger permission request flow
      // Which also adds course to calendar on callback
      signIn(
        'google',
        { callbackUrl: `/api/course/calendar?courseId=${courseId}` },
        `scope=${CALENDAR_SCOPE}`
      );
      return;
    }

    await post(`/api/course/calendar?courseId=${courseId}`);
    hideBackdrop();
  };

  const handleNoClick = () => {
    if (rememberMyDecision) {
      setItem(StorageType.INSERT_TO_CALENDAR, false);
    }
    hideBackdrop();
  };

  return (
    <Backdrop sx={{ zIndex: 1200 }} open={open}>
      <Card
        raised
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2em 1em 0.5em 1em',
          minWidth: '200px',
          width: '40%',
          minHeight: '20%',
          backgroundColor: palette.coverBlue.main,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            backgroundImage: `url("/navbar-wave.svg")`,
            backgroundPosition: 'top',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: 'scaleX(-1)',
          }}
        />
        <Typography
          variant="subtitle1"
          sx={{
            color: palette.white.main,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t('CalendarPrompt.addPrompt')}
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'column',
            margin: '0.5em 0',
            gap: 1,
          }}
          className="button-container"
          display="flex"
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Checkbox
              sx={{ color: palette.white.main }}
              checked={rememberMyDecision}
              onChange={(event) => setRememberMyDecision(event.target.checked)}
            />
            <Typography
              variant="subtitle1"
              sx={{
                color: palette.white.main,
                position: 'relative',
                zIndex: 1,
                margin: '0.5em',
                textAlign: 'center',
              }}
            >
              {t('CalendarPrompt.checkbox.remember')}
            </Typography>
          </Box>
          <Button variant="outlined" onClick={() => handleNoClick()}>
            {t('CalendarPrompt.button.no')}
          </Button>
          <Button variant="contained" onClick={() => handleYesClick()}>
            {t('CalendarPrompt.button.yes')}
          </Button>
        </Box>
      </Card>
    </Backdrop>
  );
}
