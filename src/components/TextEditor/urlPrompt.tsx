import { Box, Button, Popper, TextField, Typography } from '@mui/material';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { SyntheticEvent, useState } from 'react';

type PromptWindowProps = {
  open: boolean;
  anchorElement: null | HTMLElement;
  callbackFn: (_url: string | null) => void;
};

type ClosePromptEvent = MouseEvent | TouchEvent | SyntheticEvent;

export const PromptWindow = ({
  open,
  anchorElement,
  callbackFn,
}: PromptWindowProps) => {
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
              backgroundColor: 'surface.main',
              p: 1.5,
              borderStyle: 'solid',
              borderColor: 'black.main',
              borderWidth: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="h4">Please enter the URL</Typography>
            <TextField
              id="imageUrl"
              label="Image URL"
              variant="outlined"
              size="small"
              color="secondary"
              autoComplete="false"
              autoFocus
              onChange={(e) => setUserInput(e.target.value)}
              sx={{ mb: 1 }}
            />
            <br />
            <Button type="submit" color="secondary" onClick={handleSubmit}>
              Apply
            </Button>
            <Button
              sx={{ color: 'tertiary.main' }}
              variant="text"
              onClick={handleClose}
            >
              Close
            </Button>
          </Box>
        </Popper>
      </ClickAwayListener>
    )
  );
};
