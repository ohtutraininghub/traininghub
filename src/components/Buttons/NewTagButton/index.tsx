'use client';

import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@i18n/client';
import { Button } from '@mui/material';
import Link from 'next/link';

interface Props extends DictProps {}

export default function NewTagButton({ lang }: Props) {
  const { t } = useTranslation(lang, 'components');
  return (
    <>
      <Link href="/admin/create-tag">
        <Button variant="contained" sx={{ mb: 1 }}>
          {t('NewTagButton.newTag')}
        </Button>
      </Link>
    </>
  );
}
