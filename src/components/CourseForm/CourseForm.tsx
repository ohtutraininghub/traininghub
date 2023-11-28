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
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

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

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [lastEnrollDate, setLastEnrollDate] = useState<Date | null>(null);
  const [lastCancelDate, setLastCancelDate] = useState<Date | null>(null);

  useEffect(() => {}, [lastEnrollDate, lastCancelDate, startDate, endDate]);

  const dateHasData = (date: Date, lastDate: string) => {
    const setterFunction =
      lastDate === 'lastEnrollDate'
        ? setLastEnrollDate
        : lastDate === 'lastCancelDate'
        ? setLastCancelDate
        : null;
    const dayChooser =
      lastDate === 'lastEnrollDate'
        ? lastEnrollDate
        : lastDate === 'lastCancelDate'
        ? lastCancelDate
        : null;
    setterFunction?.(
      dayChooser === null ? new Date(endOftheDay(date)) : new Date(date)
    );
    //@ts-ignore
    setValue(lastDate, dateToDateTimeLocal(date));
  };

  const endOftheDay = (date: Date) => {
    date.setHours(23);
    date.setMinutes(59);
    return date;
  };

  const setCurrentTime = (date: Dayjs) => {
    const currentDate = new Date();
    const updatedDate = date.toDate();
    updatedDate.setHours(currentDate.getHours());
    updatedDate.setMinutes(currentDate.getMinutes());
    return updatedDate;
  };

  const updateValue = (
    newValue: Date | Dayjs | null,
    currentValue: Date | null | undefined
  ) => {
    return newValue
      ? //@ts-ignore
        dayjs(dateToDateTimeLocal(newValue))
      : courseData && currentValue
      ? dayjs(dateToDateTimeLocal(currentValue))
      : null;
  };

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              error={!!errors.name}
              autoComplete="off"
              inputProps={{
                'data-testid': 'courseFormName',
              }}
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
                        <Box
                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
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
            <DateTimePicker
              {...register('startDate')}
              data-testid="courseFormStartDate"
              value={updateValue(startDate, courseData?.startDate)}
              onChange={(value) => {
                if (value !== null && dayjs(value).isValid()) {
                  const currentTime = setCurrentTime(value);
                  const selectedDate = dayjs(currentTime).toDate();
                  setStartDate(selectedDate);
                  //@ts-ignore
                  setValue('startDate', dateToDateTimeLocal(selectedDate));
                } else {
                  setStartDate(null);
                  //@ts-ignore
                  setValue('startDate', '');
                }
              }}
              timeSteps={{ minutes: 1 }}
              slotProps={{
                textField: {
                  inputProps: { 'data-testid': 'courseFormStartDate' },
                  variant: 'outlined',
                },
                actionBar: {
                  actions: ['accept', 'cancel', 'today', 'clear'],
                },
              }}
              //@ts-ignore
              id="courseFormStartDate"
              error={!!errors.startDate}
            />
            <FormFieldError error={errors.startDate} />
            <InputLabel htmlFor="courseFormEndDate">
              {t('CourseForm.endDate')}
            </InputLabel>
            <DateTimePicker
              {...register('endDate')}
              value={updateValue(endDate, courseData?.endDate)}
              onChange={(value) => {
                if (value !== null && dayjs(value).isValid()) {
                  const currentTime = setCurrentTime(value);
                  const selectedDate = dayjs(currentTime).toDate();
                  setEndDate(selectedDate);
                  //@ts-ignore
                  setValue('endDate', dateToDateTimeLocal(selectedDate));
                } else {
                  setEndDate(null);
                  //@ts-ignore
                  setValue('endDate', '');
                }
              }}
              timeSteps={{ minutes: 1 }}
              slotProps={{
                textField: {
                  inputProps: { 'data-testid': 'courseFormEndDate' },
                  variant: 'outlined',
                },
                actionBar: {
                  actions: ['accept', 'cancel', 'today', 'clear'],
                },
              }}
              //@ts-ignore
              id="courseFormEndDate"
              error={!!errors.endDate}
            />
            <FormFieldError error={errors.endDate} />

            <InputLabel htmlFor="courseFormLastEnrollDate">
              {t('CourseForm.lastEnrollDate')}
            </InputLabel>
            <DateTimePicker
              {...register('lastEnrollDate')}
              data-testid="courseFormLastEnrollDate"
              value={updateValue(lastEnrollDate, courseData?.lastEnrollDate)}
              onChange={(value) => {
                if (value !== null && dayjs(value).isValid()) {
                  const selectedDate = dayjs(value).toDate();
                  dateHasData(selectedDate, 'lastEnrollDate');
                } else {
                  setLastEnrollDate(null);
                  //@ts-ignore
                  setValue('lastEnrollDate', '');
                }
              }}
              timeSteps={{ minutes: 1 }}
              slotProps={{
                textField: {
                  inputProps: { 'data-testid': 'courseFormLastEnrollDate' },
                  variant: 'outlined',
                },
                actionBar: {
                  actions: ['accept', 'cancel', 'today', 'clear'],
                },
              }}
              //@ts-ignore
              id="courseFormLastEnrollDate"
              error={!!errors.lastEnrollDate}
            />
            <FormFieldError error={errors.lastEnrollDate} />

            <InputLabel htmlFor="courseFormLastCancelDate">
              {t('CourseForm.lastCancelDate')}
            </InputLabel>
            <DateTimePicker
              {...register('lastCancelDate')}
              value={updateValue(lastCancelDate, courseData?.lastCancelDate)}
              onChange={(value) => {
                if (value !== null && dayjs(value).isValid()) {
                  const selectedDate = dayjs(value).toDate();
                  dateHasData(selectedDate, 'lastCancelDate');
                } else {
                  setLastCancelDate(null);
                  //@ts-ignore
                  setValue('lastCancelDate', '');
                }
              }}
              timeSteps={{ minutes: 1 }}
              slotProps={{
                textField: {
                  inputProps: { 'data-testid': 'courseFormLastCancelDate' },
                  variant: 'outlined',
                },
                actionBar: {
                  actions: ['accept', 'cancel', 'today', 'clear'],
                },
              }}
              //@ts-ignore
              id="courseFormLastCancelDate"
              error={!!errors.lastEnrollDate}
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
    </LocalizationProvider>
  );
}
