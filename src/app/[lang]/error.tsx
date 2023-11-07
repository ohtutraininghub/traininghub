'use client';

import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

interface Props extends DictProps {
  reset: () => void;
}

export default function Error({ reset, lang }: Props) {
  const { t } = useTranslation(lang);
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
        {t('Error.somethingWrong')}
      </Button>
    </Box>
  );
}
