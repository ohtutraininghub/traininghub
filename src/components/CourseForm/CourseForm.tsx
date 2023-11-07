'use client';

import {
  Input,
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
import FormFieldError from '../FormFieldError/FormFieldError';
import { Tag } from '@prisma/client';
import { dateToDateTimeLocal } from '@/lib/timedateutils';
import { CourseWithTags } from '@/lib/prisma/courses';
import { useTranslation } from '@i18n/client';
import { DictProps } from '@i18n/index';
import RichTextEditor from '@/components/TextEditor';

interface CourseFormProps extends DictProps {
  tags: Tag[];
  courseData?: CourseWithTags;
}

type FormType = CourseSchemaType | CourseSchemaWithIdType;

export default function CourseForm({
  courseData,
  lang,
  tags,
}: CourseFormProps) {
  const { t } = useTranslation(lang);
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
            tags: courseData.tags.map((tag) => tag.name),
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
          backgroundColor: palette.surface.main,
          boxShadow: 8,
        }}
      >
        <Typography
          variant="h4"
          color={palette.black.main}
          textAlign="center"
          marginBottom={1}
        >
          {!isEditMode ? 'Add New Course' : 'Edit Course Details'}
        </Typography>
        <form
          id="courseForm"
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          onSubmit={handleSubmit(submitForm)}
        >
          <InputLabel htmlFor="courseFormName">
            {t('CourseForm.name')}
          </InputLabel>
          <Input
            {...register('name')}
            id="courseFormName"
            data-testid="courseFormName"
            error={!!errors.name}
            autoComplete="off"
          />
          <FormFieldError error={errors.name} />

          <InputLabel htmlFor="courseFormDescription">
            {t('CourseForm.description')}
          </InputLabel>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <RichTextEditor value={value} onChange={onChange} />
            )}
          />
          <FormFieldError error={errors.description} />

          <Controller
            name="tags"
            control={control}
            defaultValue={[]}
            render={({ field }) => {
              return (
                <>
                  <InputLabel htmlFor="tagSelection">
                    {t('CourseForm.tags')}
                  </InputLabel>
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
                              backgroundColor: palette.surface.light,
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
                          '&.Mui-selected': {
                            backgroundColor: palette.surface.main,
                          },
                          '&.Mui-selected.Mui-focusVisible': {
                            backgroundColor: palette.surface.dark,
                          },
                          '&:hover': {
                            backgroundColor: palette.surface.light,
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: palette.surface.main,
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
          <InputLabel htmlFor="courseFormStartDate">
            {t('CourseForm.startDate')}
          </InputLabel>
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
          <InputLabel htmlFor="courseFormEndDate">
            {t('CourseForm.endDate')}
          </InputLabel>
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
          <InputLabel htmlFor="courseFormMaxStudents">
            {t('CourseForm.maxStudents')}
          </InputLabel>
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
              color: palette.white.main,
              backgroundColor: palette.secondary.main,
              '&:hover': {
                backgroundColor: palette.secondary.light,
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
