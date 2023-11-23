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
import { useEffect, useState } from 'react';

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
    setValue,
  } = useForm<FormType>({
    resolver: zodResolver(isEditMode ? courseSchemaWithId : courseSchema),
    defaultValues: {
      ...(isEditMode
        ? {
            ...courseData,
            startDate: undefined,
            endDate: undefined,
            lastEnrollDate: undefined,
            lastCancelDate: undefined,
            tags: courseData.tags.map((tag) => tag.name),
          }
        : { maxStudents: 10 }),
    },
  });

  const [lastEnrollDate, setLastEnrollDate] = useState<Date | ''>('');
  const [lastCancelDate, setLastCancelDate] = useState<Date | ''>('');
  const [endDate, setEndDate] = useState<Date | ''>('');

  useEffect(() => {
    setLastEnrollDate(endDate);
    setLastCancelDate(endDate);
    setValue('lastCancelDate', new Date(endDate));
    setValue('lastEnrollDate', new Date(endDate));
  }, [endDate, setValue]);

  const submitForm = async (data: FormType) => {
    console.log(data);
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
          variant="h2"
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
            color="secondary"
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
            data-testid="courseFormDescription"
            name="description"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <RichTextEditor lang={lang} value={value} onChange={onChange} />
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
                    color="secondary"
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
            color="secondary"
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
            color="secondary"
            value={
              endDate
                ? dateToDateTimeLocal(endDate)
                : courseData && courseData.endDate
                ? dateToDateTimeLocal(courseData.endDate)
                : ''
            }
            onChange={(e) => {
              const endDateValue = e.target.value;
              setEndDate(endDateValue !== '' ? new Date(endDateValue) : '');
            }}
            id="courseFormEndDate"
            type="datetime-local"
            error={!!errors.endDate}
            inputProps={{
              'data-testid': 'courseFormEndDate',
            }}
          />
          <FormFieldError error={errors.endDate} />

          <InputLabel htmlFor="courseFormLastEnrollDate">
            {t('CourseForm.lastEnrollDate')}
          </InputLabel>
          <Input
            {...register('lastEnrollDate')}
            color="secondary"
            value={
              lastEnrollDate
                ? dateToDateTimeLocal(lastEnrollDate)
                : courseData && courseData.lastEnrollDate
                ? dateToDateTimeLocal(courseData.lastEnrollDate)
                : ''
            }
            onChange={(e) => {
              const selectedDate = e.target.value;
              setLastEnrollDate(
                selectedDate !== '' ? new Date(selectedDate) : ''
              );
            }}
            id="courseFormLastEnrollDate"
            type="datetime-local"
            error={!!errors.lastEnrollDate}
            inputProps={{
              'data-testid': 'courseFormLastEnrollDate',
            }}
          />
          <FormFieldError error={errors.lastEnrollDate} />

          <InputLabel htmlFor="courseFormLastCancelDate">
            {t('CourseForm.lastCancelDate')}
          </InputLabel>
          <Input
            {...register('lastCancelDate')}
            color="secondary"
            value={
              lastCancelDate
                ? dateToDateTimeLocal(lastCancelDate)
                : courseData && courseData.lastCancelDate
                ? dateToDateTimeLocal(courseData.lastCancelDate)
                : ''
            }
            onChange={(e) => {
              const selectedDate = e.target.value;
              setLastCancelDate(
                selectedDate !== '' ? new Date(selectedDate) : ''
              );
            }}
            id="courseFormLastCancelDate"
            type="datetime-local"
            error={!!errors.lastCancelDate}
            inputProps={{
              'data-testid': 'courseFormLastCancelDate',
            }}
          />
          <FormFieldError error={errors.lastCancelDate} />

          <InputLabel htmlFor="courseFormMaxStudents">
            {t('CourseForm.maxStudents')}
          </InputLabel>
          <Input
            {...register('maxStudents', {
              setValueAs: (value) => Number(value),
            })}
            color="secondary"
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
