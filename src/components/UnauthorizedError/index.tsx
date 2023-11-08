'use client';

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@i18n/client';
import { DictProps } from '@/lib/i18n';

interface Props extends DictProps {}

export default function UnauthorizedError({ lang }: Props) {
  const router = useRouter();
  const { t } = useTranslation(lang, 'components');
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 10,
      }}
    >
      <Typography variant="h4" sx={{ m: 4 }}>
        {t('Unauthorized.unauthorizedMessage')}
      </Typography>
      <Button variant="contained" onClick={() => router.push('/')}>
        {t('Unauthorized.backToHome')}
      </Button>
    </Box>
  );
}
