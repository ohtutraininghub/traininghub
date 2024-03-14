'use client';

import { DictProps } from '@i18n/index';
import { useTranslation } from '@i18n/client';
import {
  Backdrop,
  Box,
  Button,
  Card,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTheme } from '@mui/material/styles';

interface Props extends DictProps {
  backdropOpen: boolean;
  setBackdropOpen: Dispatch<SetStateAction<boolean>>;
  confirmMessage: string;
  handleClick: () => void;
  includeCheckbox?: boolean;
}

export function ConfirmCard({
  backdropOpen,
  setBackdropOpen,
  confirmMessage,
  handleClick,
  lang,
  includeCheckbox = false,
}: Props) {
  const { t } = useTranslation(lang, 'components');
  const { palette } = useTheme();

  const [isNotifyChecked, setIsNotifyChecked] = useState(false);

  return (
    <Backdrop
      sx={{ zIndex: 1200 }}
      open={backdropOpen}
      onClick={() => setBackdropOpen(false)}
    >
      <Card
        raised
        data-testid="confirmCard"
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
        onClick={(event) => event.stopPropagation()} // Stop event propagation here
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
          {confirmMessage}
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            margin: '0.5em 0',
            gap: 1,
          }}
          className="button-container"
          display="flex"
        >
          {includeCheckbox && (
            <FormGroup>
              <FormControlLabel
                label="Notify participants on Slack"
                control={
                  <Checkbox
                    checked={isNotifyChecked}
                    onChange={(event) => {
                      setIsNotifyChecked(event.target.checked);
                    }}
                  />
                }
              />
            </FormGroup>
          )}
          <Button
            variant="outlined"
            data-testid="confirmCardCancel"
            onClick={() => setBackdropOpen(false)}
          >
            {t('ConfirmCard.cancel')}
          </Button>

          <Button
            variant="contained"
            data-testid="confirmCardConfirm"
            onClick={handleClick}
          >
            {t('ConfirmCard.confirm')}
          </Button>
        </Box>
      </Card>
    </Backdrop>
  );
}
