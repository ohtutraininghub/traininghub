import { Box, Button, Popper, TextField, Typography } from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useTranslation } from '@/lib/i18n/client';
import { DictProps } from '@/lib/i18n';
import { SyntheticEvent, useEffect, useState } from 'react';
import { linkSchema } from '@/lib/zod/links';

export type AnchorWithContext = {
  element: HTMLElement;
  state: 'link' | 'image';
  text: string;
};

export type CallbackObj = {
  state: AnchorWithContext['state'];
  url: string;
  text: string;
};
interface PromptWindowProps extends DictProps {
  open: boolean;
  anchorObj: null | AnchorWithContext;
  callbackFn: (_props: CallbackObj | null) => void;
}

type ClosePromptEvent = MouseEvent | TouchEvent | SyntheticEvent;

/**
 * Call anywhere within the parent component
 *
 * Will render to where HTMLElement in anchorObj points
 */
export const PromptWindow = ({
  open,
  anchorObj,
  callbackFn,
  lang,
}: PromptWindowProps) => {
  const { t } = useTranslation(lang, 'components');
  const [userInput, setUserInput] = useState<string>('');
  const [displayText, setDisplayText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    anchorObj && setDisplayText(anchorObj.text);
  }, [anchorObj]);

  const validateLink = () => {
    const parseResult = linkSchema.safeParse(userInput);
    if (!parseResult.success) {
      setErrorMsg(parseResult.error.format()._errors.toString());
      return false;
    }
    return true;
  };

  const reset = () => {
    setUserInput('');
    setErrorMsg('');
    setDisplayText('');
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (anchorObj && validateLink()) {
      callbackFn({
        state: anchorObj.state,
        url: userInput,
        text: displayText,
      });
      reset();
    }
  };
  const handleClose = (event: ClosePromptEvent) => {
    event.preventDefault();
    callbackFn(null);
    reset();
  };

  return (
    anchorObj && (
      <ClickAwayListener onClickAway={handleClose}>
        <Popper open={open} anchorEl={anchorObj.element}>
          <Box
            flexWrap="wrap"
            sx={{
              boxShadow: 2,
              backgroundColor: 'surface.main',
              p: 2,
              borderStyle: 'solid',
              borderColor: 'black.main',
              borderWidth: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="h4">
              {anchorObj.state === 'image'
                ? t('TextEditor.prompt.mainImageLabel')
                : t('TextEditor.prompt.mainLinkLabel')}
            </Typography>
            <TextField
              id="urlPrompt"
              error={!!errorMsg}
              helperText={errorMsg}
              label={t('TextEditor.prompt.urlLabel')}
              variant="outlined"
              size="small"
              color="secondary"
              autoComplete="false"
              autoFocus
              onChange={(e) => setUserInput(e.target.value)}
              sx={{ mt: 2.5, mb: 2.5 }}
            />
            {anchorObj.state === 'link' && (
              <>
                <br />
                <TextField
                  id="linkText"
                  label={t('TextEditor.prompt.displayTextLabel')}
                  variant="outlined"
                  size="small"
                  color="secondary"
                  defaultValue={anchorObj.text}
                  sx={{ mb: 2.5 }}
                  onChange={(e) => setDisplayText(e.target.value)}
                />
              </>
            )}
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
