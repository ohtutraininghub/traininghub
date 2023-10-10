'use client';

import { Backdrop, Box, Button, Card, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { DictProps } from '@/lib/i18n';
import { useDictionary } from '@/lib/i18n/hooks';

interface Props extends DictProps {
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
  lang,
}: Props) {
  const dict = useDictionary(lang);

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
          <Button onClick={() => setBackdropOpen(false)}>
            {dict.ConfirmCard.cancel}
          </Button>
          <Button variant="outlined" onClick={handleClick}>
            {dict.ConfirmCard.confirm}
          </Button>
        </Box>
      </Card>
    </Backdrop>
  );
}
