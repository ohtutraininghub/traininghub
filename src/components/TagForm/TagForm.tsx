'use client';

import { TagSchemaType, tagSchema } from '@/lib/zod/tags';
import { TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldError from '@/components/FormFieldError/FormFieldError';

export default function TagForm() {
  const router = useRouter();
  const { palette } = useTheme();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<TagSchemaType>({
    resolver: zodResolver(tagSchema),
  });

  const submitForm = async (data: TagSchemaType) => {
    try {
      const response = await fetch('/api/tag', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw response;
      }
      reset();
      router.refresh();
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
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
            color: palette.white.main,
            backgroundColor: palette.darkBlue.main,
            '&:hover': {
              backgroundColor: palette.info.main,
            },
          }}
        >
          Submit
        </Button>
      </form>
    </>
  );
}
