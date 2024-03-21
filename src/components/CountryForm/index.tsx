'use client';

import {
  CountrySchemaType,
  countrySchema,
  maxCountryLength,
} from '@/lib/zod/countries';
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldError from '@/components/FormFieldError';
import { useMessage } from '../Providers/MessageProvider';
import { post } from '@/lib/response/fetchUtil';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@i18n/client';

interface Props extends DictProps {}

export default function CountryForm({ lang }: Props) {
  const router = useRouter();
  const { notify } = useMessage();
  const { t } = useTranslation(lang, 'admin');

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<CountrySchemaType>({
    resolver: zodResolver(countrySchema),
  });

  const submitForm = async (data: CountrySchemaType) => {
    data.name = data.name.replace(/\s{2,}/g, ' ').trim();
    const responseJson = await post('/api/country', data);
    notify(responseJson);
    reset();
    router.refresh();
  };

  return (
    <FormControl component="form" onSubmit={handleSubmit(submitForm)}>
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
        <OutlinedInput
          placeholder={t('CountryForm.placeholderText')}
          {...register('name')}
          inputProps={{
            maxLength: maxCountryLength + 1,
            sx: { padding: '0.75rem' },
            'data-testid': 'countryFormInput',
          }}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="contained"
          sx={{}}
          data-testid="countrySubmitButton"
        >
          {t('CountryForm.button.submit')}
        </Button>
      </Box>
      <FormFieldError error={errors.name} />
    </FormControl>
  );
}
