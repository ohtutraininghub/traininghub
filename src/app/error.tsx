'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

export default function Error({ reset }: { reset: () => void }) {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
        borderRadius: 2,
        backgroundColor: palette.secondary.main,
      }}
    >
      <Button
        onClick={() => reset()}
        sx={{
          margin: 'auto',
          mt: 2,
          color: palette.secondary.main,
          backgroundColor: palette.darkBlue.main,
          '&:hover': {
            backgroundColor: palette.info.main,
          },
        }}
      >
        Something went wrong... Try again
      </Button>
    </Box>
  );
}
