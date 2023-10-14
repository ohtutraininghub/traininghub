'use client';

import { TagSchemaType, tagSchema } from '@/lib/zod/tags';
import { TextField, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldError from '@/components/FormFieldError/FormFieldError';
import { useMessage } from '../Providers/MessageProvider';
import { post } from '@/lib/response/fetchUtil';

export default function TagForm() {
  const router = useRouter();
  const { notify } = useMessage();

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
          <TextField label="Tag name" {...register('name')}></TextField>
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
            Submit
          </Button>
        </form>
      </Box>
    </>
  );
}
