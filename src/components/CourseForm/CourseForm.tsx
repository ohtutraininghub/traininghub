'use client';

import { Input, TextField, InputLabel, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, CourseSchemaType } from '@/lib/zod/courses';
import FormFieldError from '../FormFieldError/FormFieldError';
import { useMessages } from '../Providers/MessageProvider';
import { MessageResponseType } from '@/lib/response/responseUtil';

export default function CourseForm() {
  const { palette } = useTheme();
  const router = useRouter();
  const { notify } = useMessages();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      maxStudents: 10,
    },
  });

  const submitForm = async (data: CourseSchemaType) => {
    const response = await fetch('/api/course', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const jsonResponse: MessageResponseType = await response.json();
    notify(jsonResponse);

    reset();
    router.refresh();
  };

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        maxWidth: '95%',
        width: '400px',
        backgroundColor: palette.secondary.main,
      }}
    >
      <form
        id="courseForm"
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        onSubmit={handleSubmit(submitForm)}
      >
        <InputLabel htmlFor="courseFormName">Name</InputLabel>
        <Input
          {...register('name')}
          id="courseFormName"
          data-testid="courseFormName"
          error={!!errors.name}
          autoComplete="off"
        />
        <FormFieldError error={errors.name} />

        <InputLabel htmlFor="courseFormDescription">Description</InputLabel>
        <TextField
          {...register('description')}
          id="courseFormDescription"
          multiline
          minRows={5}
          error={!!errors.description}
          autoComplete="off"
          inputProps={{
            'data-testid': 'courseFormDescription',
          }}
        />
        <FormFieldError error={errors.description} />

        <InputLabel htmlFor="courseFormStartDate">Start date</InputLabel>
        <Input
          {...register('startDate')}
          id="courseFormStartDate"
          type="datetime-local"
          error={!!errors.startDate}
          inputProps={{
            'data-testid': 'courseFormStartDate',
          }}
        />
        <FormFieldError error={errors.startDate} />

        <InputLabel htmlFor="courseFormEndDate">End date</InputLabel>
        <Input
          {...register('endDate')}
          id="courseFormEndDate"
          type="datetime-local"
          error={!!errors.endDate}
          inputProps={{
            'data-testid': 'courseFormEndDate',
          }}
        />
        <FormFieldError error={errors.endDate} />

        <InputLabel htmlFor="courseFormMaxStudents">Max students</InputLabel>
        <Input
          {...register('maxStudents', {
            setValueAs: (value) => Number(value),
          })}
          id="courseFormMaxStudents"
          type="number"
          error={!!errors.maxStudents}
          inputProps={{
            min: 1,
            'data-testid': 'courseFormMaxStudents',
          }}
        />
        <FormFieldError error={errors.maxStudents} />

        <Button
          type="submit"
          disabled={isSubmitting}
          sx={{
            display: 'block',
            margin: 'auto',
            mt: 2,
            color: palette.secondary.main,
            backgroundColor: palette.darkBlue.main,
            '&:hover': {
              backgroundColor: palette.info.main,
            },
          }}
          data-testid="courseFormSubmit"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}
