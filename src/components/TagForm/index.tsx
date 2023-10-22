'use client';

import { TagSchemaType, tagSchema, maxTagLength } from '@/lib/zod/tags';
import { TextField, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldError from '@/components/FormFieldError/FormFieldError';
import { useMessage } from '../Providers/MessageProvider';
import { post } from '@/lib/response/fetchUtil';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@i18n/client';

interface Props extends DictProps {}

export default function TagForm({ lang }: Props) {
  const router = useRouter();
  const { notify } = useMessage();
  const { t } = useTranslation(lang, 'components');

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<TagSchemaType>({
    resolver: zodResolver(tagSchema),
  });

  const submitForm = async (data: TagSchemaType) => {
    data.name = data.name.replace(/\s{2,}/g, ' ').trim();
    const responseJson = await post('/api/tag', data);
    notify(responseJson);
    reset();
    router.refresh();
  };

  return (
    <>
      <Box sx={{ mt: 1, mb: 4 }}>
        <form onSubmit={handleSubmit(submitForm)}>
          <TextField
            label="Tag name"
            {...register('name')}
            inputProps={{ maxLength: maxTagLength + 1 }}
          ></TextField>
          <FormFieldError error={errors.name}></FormFieldError>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="contained"
            sx={{
              display: 'block',
              mt: 1,
            }}
          >
            {t('TagForm.submit')}
          </Button>
        </form>
      </Box>
    </>
  );
}
