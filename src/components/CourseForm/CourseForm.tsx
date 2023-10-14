'use client';

import { Input, TextField, InputLabel, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  courseSchema,
  CourseSchemaType,
  courseSchemaWithId,
  CourseSchemaWithIdType,
} from '@/lib/zod/courses';
import { useMessage } from '../Providers/MessageProvider';
import { post, update } from '@/lib/response/fetchUtil';
import { Course } from '@prisma/client';
import FormFieldError from '../FormFieldError/FormFieldError';
import { dateToDateTimeLocal } from '@/lib/util';

type Props = {
  courseData?: Course;
};

type FormType = CourseSchemaType | CourseSchemaWithIdType;

export default function CourseForm({ courseData }: Props) {
  const isEditMode = !!courseData;
  const router = useRouter();
  const { palette } = useTheme();
  const { notify } = useMessage();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(isEditMode ? courseSchemaWithId : courseSchema),
    defaultValues: {
      ...(isEditMode
        ? {
            ...courseData,
            startDate: undefined,
            endDate: undefined,
          }
        : { maxStudents: 10 }),
    },
  });

  const submitForm = async (data: FormType) => {
    const responseJson = isEditMode
      ? await update(`/api/course`, data)
      : await post('/api/course', data);

    notify(responseJson);

    if (!isEditMode) {
      reset();
    }
    router.push('/');
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
            style: {
              resize: 'both',
            },
            defaultValue: courseData?.description,
          }}
        />
        <FormFieldError error={errors.description} />

        <InputLabel htmlFor="courseFormStartDate">Start date</InputLabel>
        <Input
          {...register('startDate')}
          defaultValue={
            courseData ? dateToDateTimeLocal(courseData.startDate) : ''
          }
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
          defaultValue={
            courseData ? dateToDateTimeLocal(courseData.endDate) : ''
          }
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
          {isEditMode ? 'Update' : 'Submit'}
        </Button>
      </form>
    </Box>
  );
}
