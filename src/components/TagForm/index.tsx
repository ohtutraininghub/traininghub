'use client';

import { TagSchemaType, tagSchema } from '@/lib/zod/tags';
import { TextField, Button, Alert, AlertColor, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import FormFieldError from '@/components/FormFieldError/FormFieldError';
import { useState } from 'react';

export default function TagForm() {
  const router = useRouter();
  const [notification, setNotification] = useState('');
  const [severity, setSeverity] = useState<AlertColor | undefined>();

  interface NotificationProps {
    message: string;
    severity: AlertColor | undefined;
  }

  const Notification = (props: NotificationProps) => {
    return props.message ? (
      <Alert severity={props.severity} onClose={hideNotification}>
        {props.message}
      </Alert>
    ) : null;
  };

  const hideNotification = () => {
    setNotification('');
  };

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

      const responseData = await response.json();
      setNotification('Tag ' + responseData.data.name + ' was created.');
      setSeverity('success');

      reset();
      router.refresh();
    } catch (error: any) {
      try {
        const responseData = await error.json();
        setNotification(responseData.error);
        setSeverity('error');
      } catch (e) {
        console.log(error?.statusText ?? '');
      }
      reset();
    }
  };

  return (
    <>
      <Notification severity={severity} message={notification} />
      <Box sx={{ mt: 1, mb: 4 }}>
        <form onSubmit={handleSubmit(submitForm)}>
          <TextField
            label="Tag name"
            {...register('name')}
            onFocus={hideNotification}
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
            Submit
          </Button>
        </form>
      </Box>
    </>
  );
}
