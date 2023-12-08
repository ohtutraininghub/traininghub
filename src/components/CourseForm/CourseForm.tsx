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
import StyledTooltip from '@/components/StyledTooltip';

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
  const [lastEnrollDate, setLastEnrollDate] = useState<Date | null | ''>(null);
  const [lastCancelDate, setLastCancelDate] = useState<Date | null | ''>(null);
  const [timeFormat, setTimeFormat] = useState(true);

  useEffect(() => {}, [
    lastEnrollDate,
    lastCancelDate,
    startDate,
    endDate,
    timeFormat,
  ]);

  const dateHasData = (date: Date, lastDate: any) => {
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
    setValue(lastDate, dateToDateTimeLocal(date));
  };

  const endOftheDay = (date: Date) => {
    date.setHours(23);
    date.setMinutes(59);
    return date;
  };

  const updateValue = (
    newValue: any,
    currentValue: Date | null | undefined
  ) => {
    return newValue
      ? dayjs(dateToDateTimeLocal(newValue))
      : courseData && currentValue
      ? dayjs(dateToDateTimeLocal(currentValue))
      : null;
  };

  const validateCompulsory = (date: Dayjs | null, compulsoryDay: any) => {
    let setterFunction =
      compulsoryDay === 'startDate' ? setStartDate : setEndDate;
    const isValidDate = date !== null && dayjs(date).isValid();
    let selectedDate: any;
    selectedDate = isValidDate ? dayjs(date).toDate() : null;
    setterFunction(selectedDate);
    setValue(
      compulsoryDay,
      isValidDate ? dateToDateTimeLocal(selectedDate) : ''
    );
  };

  const validateOptional = (date: Dayjs | null, lastDay: any) => {
    let setterFunction =
      lastDay === 'lastCancelDay' ? setLastCancelDate : setLastEnrollDate;
    if (date !== null && dayjs(date).isValid()) {
      const selectedDate = dayjs(date).toDate();
      dateHasData(selectedDate, lastDay);
    } else if (date === null) {
      setterFunction(null);
      setValue(lastDay, '');
    } else {
      setValue(lastDay, 'invalid date');
    }
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
        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={() => setTimeFormat(!timeFormat)}
            variant="contained"
            sx={{
              display: 'block',
              mt: 2,
              color: palette.white.main,
              backgroundColor: palette.secondary.main,
              '&:hover': {
                backgroundColor: palette.secondary.light,
              },
            }}
          >
            Toggle Time Format
          </Button>
        </Box>
        <Typography
          variant="h2"
          color={palette.black.main}
          textAlign="center"
          marginBottom={1}
        >
          {!isEditMode ? 'Add New Course' : 'Edit Course Details'}
          <StyledTooltip
            lang={lang}
            data-testid={
              !isEditMode ? 'tooltipCreateCourse' : 'tooltipEditCourse'
            }
            title={
              !isEditMode ? t('Tooltip.createCourse') : t('Tooltip.editCourse')
            }
          />
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
            <StyledTooltip
              testid="tooltipCourseDescription"
              lang={lang}
              title={t('Tooltip.courseDescription')}
            />
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
                    <StyledTooltip
                      data-testid="tooltipTags"
                      lang={lang}
                      title={t('Tooltip.tags')}
                    />
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
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
            <InputLabel htmlFor="courseFormStartDate">
              {t('CourseForm.startDate')}
              YEEEEEET
              <StyledTooltip
                data-testid="tooltipStartDate"
                lang={lang}
                title={t('Tooltip.startDate')}
              />
            </InputLabel>
            <DateTimePicker
              {...register('startDate')}
              value={updateValue(startDate, courseData?.startDate)}
              onChange={(value) => {
                validateCompulsory(value, 'startDate');
              }}
              ampm={!timeFormat}
              timeSteps={{ minutes: 1 }}
              slotProps={{
                textField: {
                  id: 'courseFormStartDate',
                  inputProps: {
                    readOnly: false,
                    'data-testid': 'courseFormStartDate',
                  },
                  variant: 'outlined',
                  error: !!errors.startDate,
                },
                actionBar: {
                  actions: ['accept', 'cancel', 'today', 'clear'],
                },
              }}
            />
            <FormFieldError error={errors.startDate} />
            <InputLabel htmlFor="courseFormEndDate">
              {t('CourseForm.endDate')}
              <StyledTooltip
                data-testid="tooltipEndDate"
                lang={lang}
                title={t('Tooltip.endDate')}
              />
            </InputLabel>
            <DateTimePicker
              {...register('endDate')}
              value={updateValue(endDate, courseData?.endDate)}
              onChange={(value) => {
                validateCompulsory(value, 'endDate');
              }}
              ampm={!timeFormat}
              timeSteps={{ minutes: 1 }}
              slotProps={{
                textField: {
                  id: 'courseFormEndDate',
                  inputProps: {
                    readOnly: false,
                    'data-testid': 'courseFormEndDate',
                  },
                  variant: 'outlined',
                  error: !!errors.endDate,
                },
                actionBar: {
                  actions: ['accept', 'cancel', 'today', 'clear'],
                },
              }}
            />
            <FormFieldError error={errors.endDate} />

            <InputLabel htmlFor="courseFormLastEnrollDate">
              {t('CourseForm.lastEnrollDate')}
              <StyledTooltip
                data-testid="tooltipLastEnrollDate"
                lang={lang}
                title={t('Tooltip.lastEnrollDate')}
              />
            </InputLabel>
            <DateTimePicker
              {...register('lastEnrollDate')}
              value={updateValue(lastEnrollDate, courseData?.lastEnrollDate)}
              onChange={(value) => {
                validateOptional(value, 'lastEnrollDate');
              }}
              ampm={!timeFormat}
              timeSteps={{ minutes: 1 }}
              slotProps={{
                textField: {
                  id: 'courseFormLastEnrollDate',
                  inputProps: {
                    readOnly: false,
                    'data-testid': 'courseFormLastEnrollDate',
                  },
                  variant: 'outlined',
                  error: !!errors.lastEnrollDate,
                },
                actionBar: {
                  actions: ['accept', 'cancel', 'today', 'clear'],
                },
              }}
            />
            <FormFieldError error={errors.lastEnrollDate} />

            <InputLabel htmlFor="courseFormLastCancelDate">
              {t('CourseForm.lastCancelDate')}
              <StyledTooltip
                data-testid="tooltipLastCancelDate"
                lang={lang}
                title={t('Tooltip.lastCancelDate')}
              />
            </InputLabel>
            <DateTimePicker
              {...register('lastCancelDate')}
              value={updateValue(lastCancelDate, courseData?.lastCancelDate)}
              onChange={(value) => {
                validateOptional(value, 'lastCancelDate');
              }}
              ampm={!timeFormat}
              timeSteps={{ minutes: 1 }}
              slotProps={{
                textField: {
                  id: 'courseFormLastCancelDate',
                  inputProps: {
                    readOnly: false,
                    'data-testid': 'courseFormLastCancelDate',
                  },
                  variant: 'outlined',
                  error: !!errors.lastEnrollDate,
                },
                actionBar: {
                  actions: ['accept', 'cancel', 'today', 'clear'],
                },
              }}
            />
            <FormFieldError error={errors.lastCancelDate} />
          </LocalizationProvider>
          <InputLabel htmlFor="courseFormMaxStudents">
            {t('CourseForm.maxStudents')}
            <StyledTooltip
              data-testid="maxStudents"
              lang={lang}
              title={t('Tooltip.maxStudents')}
            />
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
