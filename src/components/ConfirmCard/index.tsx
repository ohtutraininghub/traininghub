'use client';

import { Backdrop, Box, Button, Card, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  backdropOpen: boolean;
  setBackdropOpen: Dispatch<SetStateAction<boolean>>;
  confirmMessage: string;
  handleClick: () => void;
}

export function ConfirmCard({
  backdropOpen,
  setBackdropOpen,
  confirmMessage,
  handleClick,
}: Props) {
  return (
    <Backdrop
      sx={{ zIndex: 1200 }}
      open={backdropOpen}
      onClick={() => setBackdropOpen(false)}
    >
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
        }}
      >
        <Typography variant="subtitle1">{confirmMessage}</Typography>
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
          <Button onClick={() => setBackdropOpen(false)}>Cancel</Button>
          <Button variant="outlined" onClick={handleClick}>
            Confirm
          </Button>
        </Box>
      </Card>
    </Backdrop>
  );
}
