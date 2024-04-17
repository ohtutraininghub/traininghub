'use client';
import { Typography } from '@mui/material';
import ExportForm from './ExportForm';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';

interface Props extends DictProps {}

export default function ExportStats({ lang }: Props) {
  const { t } = useTranslation(lang, 'admin');
  return (
    <div
      style={{
        border: '1px solid lightGrey',
        borderRadius: '5px',
        padding: '1rem',
      }}
    >
      <Typography variant="h2" sx={{ marginBottom: '2rem' }}>
        {t('ExportStats.header')}
      </Typography>
      <ExportForm lang={lang} />
    </div>
  );
}
