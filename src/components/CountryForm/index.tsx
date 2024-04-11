'use client';

import { CountrySchemaType, countrySchema } from '@/lib/zod/countries';
import { Button, Box, FormControl, FormLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldError from '@/components/FormFieldError';
import { useMessage } from '../Providers/MessageProvider';
import { post } from '@/lib/response/fetchUtil';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@i18n/client';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { countries } from './countries';
import { useTheme } from '@mui/material/styles';
import { DownloadTrainingSessionsAsCSV } from '../CsvCreator';

interface Props extends DictProps {}

const trainingSessions = [
  {
    trainingName: 'Web Development Basics',
    trainerName: 'Jane Doe',
    participants: [
      { name: 'John Smith', country: 'USA', title: 'Developer' },
      { name: 'Sara Wilson', country: 'Canada', title: 'Manager' },
    ],
    date: '2024-04-12',
  },
];

export default function CountryForm({ lang }: Props) {
  const router = useRouter();
  const { notify } = useMessage();
  const { t } = useTranslation(lang, 'admin');
  const theme = useTheme();

  const {
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CountrySchemaType>({
    resolver: zodResolver(countrySchema),
  });

  const [selectedCountry, setSelectedCountry] = React.useState<string | null>(
    null
  );
  const [selectedCode, setCountryCode] = React.useState<string | null>(null);

  const submitForm = async (data: CountrySchemaType) => {
    data.name = selectedCountry || data.name.replace(/\s{2,}/g, ' ').trim();
    data.countryCode = selectedCode || '';
    const responseJson = await post('/api/country', data);
    notify(responseJson);
    reset();
    router.refresh();
  };

  return (
    <FormControl>
      <FormLabel
        sx={{
          marginBottom: '0.35rem',
          fontWeight: 500,
          color: '#000000',
        }}
      >
        {`${t('CountryForm.label')}:`}
      </FormLabel>
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Autocomplete
          onChange={(event, newValue) => {
            setSelectedCountry(newValue?.label || null);
            setCountryCode(newValue?.code || null);
          }}
          id="country-select"
          sx={{
            width: 226,
            [theme.breakpoints.down('sm')]: {
              width: 211,
            },
          }}
          options={countries}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(
            props,
            option: { label: string; code: string; phone: string }
          ) => (
            <Box
              component="li"
              sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              {option.label} ({option.code})
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('CountryForm.chooseCountry')}
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
        />
        <Button
          onClick={() => {
            if (selectedCountry && selectedCode) {
              submitForm({
                name: selectedCountry,
                countryCode: selectedCode,
              });
            }
          }}
          disabled={isSubmitting}
          variant="contained"
          sx={{}}
          data-testid="countrySubmitButton"
        >
          {t('CountryForm.button.submit')}
        </Button>
        <Button
          onClick={() => {
            DownloadTrainingSessionsAsCSV(trainingSessions);
          }}
          variant="contained"
          sx={{}}
          data-testid="countrySubmitButton"
        >
          Download CSV
        </Button>
      </Box>
      <FormFieldError error={errors.name} />
    </FormControl>
  );
}
