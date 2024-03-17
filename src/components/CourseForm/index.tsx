'use client';

import {
  Input,
  InputLabel,
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
  courseSchemaWithId,
  CourseSchemaWithIdType,
} from '@/lib/zod/courses';
import { useMessage } from '../Providers/MessageProvider';
import { post, update } from '@/lib/response/fetchUtil';
import FormFieldError from '../FormFieldError';
import { Tag } from '@prisma/client';
import { dateToDateTimeLocal } from '@/lib/timedateutils';
import { CourseWithTags } from '@/lib/prisma/courses';
import { useTranslation } from '@i18n/client';
import { DictProps } from '@i18n/index';
import RichTextEditor from '@/components/TextEditor';
import StyledTooltip from '@/components/StyledTooltip';
import TemplateSelect from './TemplateSelect';
import SubmitButton from './SubmitButton';
import SaveTemplateButton from './SaveTemplateButton';
import EditButton from './EditButton';
import { useState } from 'react';
import { TemplateWithTags } from '@/lib/prisma/templates';

interface CourseFormProps extends DictProps {
  tags: Tag[];
  courseData?: CourseWithTags;
  templates: TemplateWithTags[];
}

type FormType = CourseSchemaWithIdType;

export const getTimeStringForTomorrow = (
  hours: number,
  minutes: number = 0
): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hours, minutes, 0, 0);
  const offsetMinutes = tomorrow.getTimezoneOffset();
  tomorrow.setMinutes(tomorrow.getMinutes() - offsetMinutes);
  return tomorrow.toISOString().slice(0, 16);
};

export default function CourseForm({
  courseData,
  lang,
  tags,
  templates,
}: CourseFormProps) {
  const { t } = useTranslation(lang);
  const isEditMode = !!courseData;
  const router = useRouter();
  const { palette } = useTheme();
  const { notify } = useMessage();
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isNotifyChecked, setIsNotifyChecked] = useState(false);
  const {
    control,
    register,
    setValue,
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
            lastEnrollDate: undefined,
            lastCancelDate: undefined,
            tags: courseData.tags.map((tag) => tag.name),
          }
        : { maxStudents: 10 }),
    },
  });

  const handleNotifyChange = (checked: boolean) => {
    setIsNotifyChecked(checked);
  };

  const submitForm = async (data: FormType) => {
    const responseJson = await post('/api/course', data);

    notify(responseJson);

    reset();
    router.push('/');
    router.refresh();
  };

  const submitEdit = async (data: FormType) => {
    const payload = {
      ...data,
      isChecked: isNotifyChecked,
    };
    const responseJson = await update(`/api/course`, payload);

    notify(responseJson);
    router.push('/');
    router.refresh();
  };

  const handleTemplateDialogOpen = () => {
    setTemplateDialogOpen(!templateDialogOpen);
  };

  const handleEditDialogOpen = () => {
    setEditDialogOpen(!editDialogOpen);
  };

  const submitTemplate = async (data: FormType) => {
    console.log(
      'submitTemplate-----------------------------------------------------------------',
      data
    );
    const {
      startDate: _startDate,
      endDate: _endDate,
      lastEnrollDate: _lastEnrollDate,
      lastCancelDate: _lastCancelDate,
      createdById: _createdById,
      id: _id,
      ...dataWithoutExtras
    } = data;
    const responseJson = await post('/api/template', dataWithoutExtras);

    notify(responseJson);

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!isEditMode && templates.length > 0 ? (
            <>
              {/* Template select wont be shown if user is editing course or
            if there is no templates */}
              <InputLabel id="templateSelect">
                {t('Template.selectTemplate')}
                <StyledTooltip
                  lang={lang}
                  title={t('Tooltip.selectTemplate')}
                />
              </InputLabel>
              <TemplateSelect
                id="templateSelect"
                setValue={setValue}
                templates={templates}
              />
            </>
          ) : (
            <></>
          )}
        </div>
        <form
          id="courseForm"
          data-testid="courseForm"
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

          <InputLabel htmlFor="courseFormSummary">
            {t('CourseForm.summary')}
            <StyledTooltip
              testid="tooltipCourseSummary"
              lang={lang}
              title={t('Tooltip.summary')}
            />
          </InputLabel>
          <Input
            {...register('summary')}
            color="secondary"
            id="courseFormSummary"
            error={!!errors.summary}
            autoComplete="off"
            inputProps={{
              maxLength: 150,
              'data-testid': 'courseFormSummary',
            }}
          />
          <FormFieldError error={errors.summary} />

          <InputLabel htmlFor="courseFormImage">
            {t('CourseForm.courseImage')}
            <StyledTooltip
              testid="tooltipCourseImage"
              lang={lang}
              title={t('Tooltip.image')}
            />
          </InputLabel>
          <Input
            {...register('image')}
            id="courseFormImage"
            color="secondary"
            error={!!errors.image}
            inputProps={{
              'data-testid': 'courseFormImage',
            }}
          />

          <Controller
            name="tags"
            control={control}
            defaultValue={[]}
            render={({ field }) => {
              return (
                <>
                  <InputLabel htmlFor="tagSelection" id="tagSelection">
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
                    labelId="tagSelection"
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

          <FormFieldError error={errors.image} />
          <InputLabel htmlFor="courseFormStartDate">
            {t('CourseForm.startDate')}
            <StyledTooltip
              data-testid="tooltipStartDate"
              lang={lang}
              title={t('Tooltip.startDate')}
            />
          </InputLabel>
          <Input
            {...register('startDate')}
            color="secondary"
            defaultValue={
              courseData
                ? dateToDateTimeLocal(courseData.startDate)
                : getTimeStringForTomorrow(9)
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
            <StyledTooltip
              data-testid="tooltipEndDate"
              lang={lang}
              title={t('Tooltip.endDate')}
            />
          </InputLabel>
          <Input
            {...register('endDate')}
            color="secondary"
            defaultValue={
              courseData
                ? dateToDateTimeLocal(courseData.endDate)
                : getTimeStringForTomorrow(17)
            }
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
            <StyledTooltip
              data-testid="tooltipLastEnrollDate"
              lang={lang}
              title={t('Tooltip.lastEnrollDate')}
            />
          </InputLabel>
          <Input
            {...register('lastEnrollDate')}
            color="secondary"
            defaultValue={
              courseData && courseData.lastEnrollDate
                ? dateToDateTimeLocal(courseData.lastEnrollDate)
                : ''
            }
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
            <StyledTooltip
              data-testid="tooltipLastCancelDate"
              lang={lang}
              title={t('Tooltip.lastCancelDate')}
            />
          </InputLabel>
          <Input
            {...register('lastCancelDate')}
            color="secondary"
            defaultValue={
              courseData && courseData.lastCancelDate
                ? dateToDateTimeLocal(courseData.lastCancelDate)
                : ''
            }
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
          <SaveTemplateButton
            isSubmitting={isSubmitting}
            handleDialogOpen={handleTemplateDialogOpen}
            handleSaveTemplate={handleSubmit(submitTemplate)}
            dialogOpen={templateDialogOpen}
            lang={lang}
          />
          {isEditMode ? (
            <EditButton
              isSubmitting={isSubmitting}
              handleDialogOpen={handleEditDialogOpen}
              handleEdit={handleSubmit(submitEdit)}
              dialogOpen={editDialogOpen}
              lang={lang}
              onNotifyChange={handleNotifyChange}
            />
          ) : (
            <SubmitButton isSubmitting={isSubmitting} lang={lang} />
          )}
        </form>
      </Box>
    </Container>
  );
}
