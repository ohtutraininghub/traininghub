'use client';
import { Box, FormControl, FormLabel, Input, Button } from '@mui/material';
import StyledTooltip from '../StyledTooltip';
import { useForm } from 'react-hook-form';
import { DictProps } from '@/lib/i18n';
import {
  ExportStatsFormType,
  exportStatsFormSchema,
} from '@/lib/zod/statistics';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldError from '../FormFieldError';
import { useTranslation } from '@/lib/i18n/client';

interface Props extends DictProps {}

export default function ExportForm({ lang }: Props) {
  const { t } = useTranslation(lang, 'admin');
  const { register } = useForm();
  const {
    formState: { errors, isSubmitting },
  } = useForm<ExportStatsFormType>({
    resolver: zodResolver(exportStatsFormSchema),
  });
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: '2rem',
        alignItems: 'center',
      }}
    >
      <form onSubmit={() => {}}>
        <FormControl>
          <FormLabel
            sx={{
              fontWeight: 500,
              color: 'black.main',
              marginBottom: '0.35rem',
            }}
          >
            {t('ExportStats.fromDate')}
            <StyledTooltip
              data-testid="tooltipFromDate"
              lang={lang}
              title={t('ExportStats.tooltipFrom')}
            />
          </FormLabel>
          <Input
            sx={{
              width: '100%',
              border: '1px solid lightGrey',
              borderRadius: '5px',
              padding: '0.5rem',
              marginTop: '0px',
              '&.MuiInputBase-root': {
                marginTop: '0px',
              },
            }}
            {...register('fromDate')}
            id="exportFormFromDate"
            type="date"
            inputProps={{ 'data-testid': 'exportFormFromDate' }}
            defaultValue={`${new Date().getFullYear()}-01-01`}
          />
          <FormFieldError error={errors.fromDate} />
        </FormControl>
        <FormControl>
          <FormLabel
            sx={{
              fontWeight: 500,
              color: 'black.main',
              marginBottom: '0.35rem',
            }}
          >
            {t('ExportStats.toDate')}
            <StyledTooltip
              data-testid="tooltipToDate"
              lang={lang}
              title={t('ExportStats.tooltipTo')}
            />
          </FormLabel>
          <Input
            {...register('toDate')}
            id="exportFormToDate"
            type="date"
            sx={{
              width: '100%',
              border: '1px solid lightGrey',
              borderRadius: '5px',
              padding: '0.5rem',
              marginTop: '0px',
              '&.MuiInputBase-root': {
                marginTop: '0px',
              },
            }}
            inputProps={{ 'data-testid': 'exportFormToDate' }}
            defaultValue={new Date().toISOString().split('T')[0]}
          />
          <FormFieldError error={errors.toDate} />
        </FormControl>
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="contained"
          color="primary"
          sx={{
            marginTop: { xs: '0rem', sm: '1.5rem' },
            marginBottom: { xs: '1rem', sm: '0rem' },
          }}
        >
          {t('ExportStats.button')}
        </Button>
      </form>
    </Box>
  );
}
