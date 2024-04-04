'use client';

import { TitleSchemaType, titleSchema, maxTitleLength } from '@/lib/zod/titles';
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

export default function TitleForm({ lang }: Props) {
  const router = useRouter();
  const { notify } = useMessage();
  const { t } = useTranslation(lang, 'admin');

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<TitleSchemaType>({
    resolver: zodResolver(titleSchema),
  });

  const submitForm = async (data: TitleSchemaType) => {
    data.name = data.name.replace(/\s{2,}/g, ' ').trim();
    const responseJson = await post('/api/title', data);
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
        {`${t('TagForm.label')}:`}
      </FormLabel>
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <OutlinedInput
          placeholder={t('TagForm.placeholderText')}
          {...register('name')}
          inputProps={{
            maxLength: maxTitleLength + 1,
            sx: { padding: '0.75rem' },
            'data-testid': 'titleFormInput',
          }}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="contained"
          sx={{}}
          data-testid="titleSubmitButton"
        >
          {t('TagForm.button.submit')}
        </Button>
      </Box>
      <FormFieldError error={errors.name} />
    </FormControl>
  );
}
