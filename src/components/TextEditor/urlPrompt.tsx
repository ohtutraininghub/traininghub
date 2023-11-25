import { Box, Button, Popper, TextField, Typography } from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useTranslation } from '@/lib/i18n/client';
import { DictProps } from '@/lib/i18n';
import { SyntheticEvent, useState } from 'react';

interface PromptWindowProps extends DictProps {
  open: boolean;
  anchorElement: null | HTMLElement;
  callbackFn: (_url: string | null) => void;
}

type ClosePromptEvent = MouseEvent | TouchEvent | SyntheticEvent;

export const PromptWindow = ({
  open,
  anchorElement,
  callbackFn,
  lang,
}: PromptWindowProps) => {
  const { t } = useTranslation(lang, 'components');
  const [userInput, setUserInput] = useState<string | null>(null);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    callbackFn(userInput);
    setUserInput(null);
  };

  const handleClose = (event: ClosePromptEvent) => {
    event.preventDefault();
    callbackFn(null);
    setUserInput(null);
  };

  return (
    anchorElement && (
      <ClickAwayListener onClickAway={handleClose}>
        <Popper open={open} anchorEl={anchorElement}>
          <Box
            flexWrap="wrap"
            sx={{
              boxShadow: 2,
              backgroundColor: 'surface.main',
              p: 1.5,
              borderStyle: 'solid',
              borderColor: 'black.main',
              borderWidth: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="h4">
              {t('TextEditor.prompt.mainLabel')}
            </Typography>
            <TextField
              id="imageUrl"
              label={t('TextEditor.prompt.imageLabel')}
              variant="outlined"
              size="small"
              color="secondary"
              autoComplete="false"
              autoFocus
              onChange={(e) => setUserInput(e.target.value)}
              sx={{ mb: 1 }}
            />
            <br />
            <Box display="flex" justifyContent="end">
              <Button color="secondary" variant="text" onClick={handleClose}>
                {t('TextEditor.prompt.cancel')}
              </Button>
              <Button
                variant="contained"
                type="submit"
                color="secondary"
                onClick={handleSubmit}
              >
                {t('TextEditor.prompt.confirm')}
              </Button>
            </Box>
          </Box>
        </Popper>
      </ClickAwayListener>
    )
  );
};
