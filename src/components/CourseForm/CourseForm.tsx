'use client';

import { Input, TextField, InputLabel, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema } from '@/schemas';
import z from 'zod';
import FormFieldError from '../FormFieldError/FormFieldError';

export default function CourseForm() {
  const { palette } = useTheme();
  type CourseShema = z.infer<typeof courseSchema>;

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<CourseShema>({
    resolver: zodResolver(courseSchema),
  });

  const submitForm = async (data: CourseShema) => {
    console.log('Form submitted with values:', data);
    try {
      const response = await fetch('/api/course', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw response;
      }

      console.log('Response:', await response.json());
      reset();
    } catch (error) {
      console.error(error);
    }
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
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        onSubmit={handleSubmit(submitForm)}
      >
        <InputLabel>Name</InputLabel>
        <Input {...register('name')} error={!!errors.name} autoComplete="off" />
        <FormFieldError error={errors.name} />

        <InputLabel>Description</InputLabel>
        <TextField
          {...register('description')}
          multiline
          minRows={5}
          error={!!errors.description}
          autoComplete="off"
        />
        <FormFieldError error={errors.description} />

        <InputLabel>Start date</InputLabel>
        <Input
          {...register('startDate')}
          type="datetime-local"
          error={!!errors.startDate}
        />
        <FormFieldError error={errors.startDate} />

        <InputLabel>End date</InputLabel>
        <Input
          {...register('endDate')}
          type="datetime-local"
          error={!!errors.endDate}
        />
        <FormFieldError error={errors.endDate} />

        <InputLabel htmlFor="maxStudents">Max students</InputLabel>
        <Input
          {...register('maxStudents', {
            setValueAs: (value) => Number(value),
          })}
          type="number"
          defaultValue={10}
          inputProps={{
            min: 1,
          }}
          error={!!errors.maxStudents}
        />
        <FormFieldError error={errors.maxStudents} />

        <Button
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
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}
