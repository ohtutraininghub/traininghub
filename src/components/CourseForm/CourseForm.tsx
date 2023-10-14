'use client';

import {
  Input,
  TextField,
  InputLabel,
  Button,
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
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
import { Tag } from '@prisma/client';
import { dateToDateTimeLocal } from '@/lib/util';

type FormType = CourseSchemaType | CourseSchemaWithIdType;

type CourseFormProps = {
  tags: Tag[];
  courseData?: Course;
};

export default function CourseForm({ tags, courseData }: CourseFormProps) {
  const isEditMode = !!courseData;
  const router = useRouter();
  const { palette } = useTheme();
  const { notify } = useMessage();

  const {
    control,
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
    router.refresh();
  };

  return (
    <Container>
      <Box
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          maxWidth: '95%',
          backgroundColor: palette.secondary.main,
          boxShadow: 8,
        }}
      >
        <Typography variant="h2" color={palette.black.main}>
          Add a new course
        </Typography>
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

          <Controller
            name="tags"
            control={control}
            defaultValue={[]}
            render={({ field }) => {
              return (
                <>
                  <InputLabel htmlFor="tagSelection">Tags</InputLabel>
                  <Select
                    {...field}
                    id="tagSelection"
                    multiple
                    renderValue={(field) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {field.map((tag, idx) => (
                          <Chip
                            key={idx}
                            label={tag}
                            variant="outlined"
                            sx={{
                              backgroundColor: palette.secondary.light,
                              borderColor: palette.black.light,
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {tags.map((tag) => (
                      <MenuItem
                        key={tag.id}
                        value={tag.name}
                        divider
                        sx={{
                          '&.Mui-selected.Mui-focusVisible': {
                            backgroundColor: palette.secondary.dark,
                          },
                          '&:hover': {
                            backgroundColor: palette.secondary.light,
                          },
                          '&:focus': {
                            backgroundColor: palette.secondary.main,
                          },
                          '&.Mui-selected': {
                            backgroundColor: palette.secondary.main,
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: palette.secondary.main,
                          },
                        }}
                      >
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              );
            }}
          />

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
    </Container>
  );
}
