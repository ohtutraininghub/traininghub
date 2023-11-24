import { Box, Button, Popper, TextField, Typography } from '@mui/material';
import { useState } from 'react';

type PromptWindowProps = {
  open: boolean;
  anchorElement: null | HTMLElement;
  callbackFn: (_url: string | null) => void;
};

export const PromptWindow = ({
  open,
  anchorElement,
  callbackFn,
}: PromptWindowProps) => {
  const [userInput, setUserInput] = useState<string | null>(null);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log('Clicked Submit with: ', userInput);
    callbackFn(userInput);
    setUserInput(null);
  };

  const handleClose = (event: React.SyntheticEvent) => {
    event.preventDefault();
    callbackFn(null);
    setUserInput(null);
  };

  return (
    anchorElement && (
      <>
        <Popper open={open} anchorEl={anchorElement}>
          <Box
            flexWrap="wrap"
            sx={{
              backgroundColor: 'surface.light',
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
      </>
    )
  );
};
