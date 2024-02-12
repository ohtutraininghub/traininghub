'use client';

import { DictProps } from '@i18n/index';
import { useTranslation } from '@i18n/client';
import { Button, InputLabel, Input } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { TemplateSchemaType } from '@/lib/zod/templates';
import FormFieldError from '../FormFieldError';
import StyledTooltip from '@/components/StyledTooltip';
import RichTextEditor from '@/components/TextEditor';

interface Props extends DictProps {
  templateId: string;
  submitTemplate: () => void;
}

type FormType = TemplateSchemaType;

export function EditTemplateForm({ lang, submitTemplate }: Props) {
  const { t } = useTranslation(lang, 'components');
  const { palette } = useTheme();
  const {
    control,
    register,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {},
  });

  return (
    <>
      <form
        id="templateForm"
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        onSubmit={submitTemplate}
      >
        <InputLabel htmlFor="courseFormName">{t('CourseForm.name')}</InputLabel>
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
        <Button
          type="submit"
          variant="contained"
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
        >
          {t('EditTemplate.button.submit')}
        </Button>
      </form>
    </>
  );
}
