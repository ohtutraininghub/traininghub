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
        backgroundColor: palette.surface.main,
      }}
    >
      <Button
        onClick={() => reset()}
        sx={{
          margin: 'auto',
          mt: 2,
          color: palette.white.main,
          backgroundColor: palette.secondary.main,
          '&:hover': {
            backgroundColor: palette.secondary.light,
          },
        }}
      >
        Something went wrong... Try again
      </Button>
    </Box>
  );
}
