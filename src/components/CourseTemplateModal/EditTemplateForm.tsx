'use client';

import { DictProps } from '@i18n/index';
import { useTranslation } from '@i18n/client';
import {
  Button,
  InputLabel,
  Input,
  Select,
  Box,
  Chip,
  MenuItem,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { TemplateSchemaType } from '@/lib/zod/templates';
import FormFieldError from '../FormFieldError';
import StyledTooltip from '@/components/StyledTooltip';
import RichTextEditor from '@/components/TextEditor';
import { Tag } from '@prisma/client';
import { update } from '@/lib/response/fetchUtil';
import { useMessage } from '../Providers/MessageProvider';
import { useRouter } from 'next/navigation';
import { StatusCodeType } from '@/lib/response/responseUtil';
import { TemplateWithTags } from '@/lib/prisma/templates';

type FormType = TemplateSchemaType;

interface Props extends DictProps {
  tags: Tag[];
  templateData: TemplateWithTags;
}

export function EditTemplateForm({ lang, tags, templateData }: Props) {
  const { t } = useTranslation(lang);
  const { palette } = useTheme();
  const { notify } = useMessage();
  const router = useRouter();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({
    defaultValues: {},
  });

  async function submitTemplate(template: TemplateSchemaType): Promise<void> {
    const response = await update('/api/template', {
      ...template,
      tags: template.tags.map((tag) => ({ name: tag })),
      id: templateData.id,
      createdById: templateData.createdById,
    });
    notify(response);
    if (response.statusCode === StatusCodeType.CREATED) {
      router.push('/en/profile');
      router.refresh();
    }
  }
  return (
    <>
      <Typography
        variant="h2"
        color={palette.black.main}
        textAlign="center"
        marginBottom={1}
      >
        {t('TemplateForm.title')}
        <StyledTooltip lang={lang} title={t('Tooltip.editTemplate')} />
      </Typography>
      <form
        id="templateForm"
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        onSubmit={handleSubmit(submitTemplate)}
      >
        <InputLabel htmlFor="templateFormName">
          {t('CourseForm.name')}
        </InputLabel>
        <Input
          {...register('name')}
          color="secondary"
          id="templateFormName"
          error={!!errors.name}
          autoComplete="off"
          inputProps={{
            'data-testid': 'templateFormName',
          }}
        />
        <FormFieldError error={errors.name} />

        <InputLabel htmlFor="templateFormDescription">
          {t('CourseForm.description')}
          <StyledTooltip
            testid="tooltipCourseDescription"
            lang={lang}
            title={t('Tooltip.courseDescription')}
          />
        </InputLabel>
        <Controller
          data-testid="templateFormDescription"
          name="description"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <RichTextEditor lang={lang} value={value} onChange={onChange} />
          )}
        />
        <FormFieldError error={errors.description} />

        <InputLabel htmlFor="templateFormSummary">
          {t('CourseForm.summary')}
          <StyledTooltip
            data-testid="tooltipCourseSummary"
            lang={lang}
            title={t('Tooltip.summary')}
          />
        </InputLabel>
        <Input
          {...register('summary')}
          color="secondary"
          id="templateFormSummary"
          error={!!errors.summary}
          autoComplete="off"
          inputProps={{
            maxLength: 150,
            'data-testid': 'templateFormSummary',
          }}
        />
        <FormFieldError error={errors.summary} />

        <InputLabel htmlFor="templateFormImage">
          {t('CourseForm.courseImage')}
          <StyledTooltip
            data-testid="tooltipCourseImage"
            lang={lang}
            title={t('Tooltip.image')}
          />
        </InputLabel>
        <Input
          {...register('image')}
          id="templateFormImage"
          color="secondary"
          error={!!errors.image}
          inputProps={{
            'data-testid': 'templateFormImage',
          }}
        />
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
        <InputLabel htmlFor="templateFormMaxStudents">
          {t('CourseForm.maxStudents')}
          <StyledTooltip
            data-testid="tooltipMaxStudents"
            lang={lang}
            title={t('Tooltip.maxStudents')}
          />
        </InputLabel>
        <Input
          {...register('maxStudents', {
            setValueAs: (value) => Number(value),
          })}
          color="secondary"
          id="templateFormMaxStudents"
          type="number"
          error={!!errors.maxStudents}
          inputProps={{
            min: 1,
            'data-testid': 'templateFormMaxStudents',
          }}
        />
        <FormFieldError error={errors.maxStudents} />
        <Button
          type="submit"
          variant="contained"
          data-testid="updateTemplateButton"
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
          {t('TemplateForm.update')}
        </Button>
      </form>
    </>
  );
}
