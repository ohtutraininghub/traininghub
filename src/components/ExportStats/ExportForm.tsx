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
import { useMessage } from '../Providers/MessageProvider';
import { DownloadTrainingSessionsAsCSV } from '@/lib/csv-utils';
import { MessageType } from '@/lib/response/responseUtil';
import { get } from '@/lib/response/fetchUtil';

interface Props extends DictProps {}

export default function ExportForm({ lang }: Props) {
  const { t } = useTranslation(lang, 'admin');
  const { notify } = useMessage();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<ExportStatsFormType>({
    resolver: zodResolver(exportStatsFormSchema),
  });

  const submitForm = async (data: ExportStatsFormType) => {
    const params = new URLSearchParams();
    params.set('fromDate', data.fromDate.valueOf().toString());
    // Adding the number of milliseconds in a day to the toDate value in order to
    // include the full duration of the day
    params.set(
      'toDate',
      (data.toDate.valueOf() + 60 * 60 * 24 * 1000 - 1).toString()
    );

    const url = `/api/course/statistics?${params.toString()}`;
    const res = await get(url);
    if (!res.ok) {
      notify(await res.json());
      return;
    }
    const responseJson = await res.json();

    try {
      DownloadTrainingSessionsAsCSV(
        data.fromDate,
        data.toDate,
        responseJson.data
      );
      notify({
        message: t('ExportStats.downloadStarted'),
        messageType: MessageType.SUCCESS,
      });
    } catch (error) {
      notify({
        message: t('ExportStats.downloadFailed'),
        messageType: MessageType.ERROR,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: '1rem',
          alignItems: 'center',
        }}
      >
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
          data-testid="exportStatsButton"
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
      </Box>
    </form>
  );
}
