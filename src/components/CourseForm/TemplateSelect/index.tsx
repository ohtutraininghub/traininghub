'use client';

import { Box, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { CourseSchemaType } from '@/lib/zod/courses';
import { TemplateWithTags } from '@/lib/prisma/templates';

type FormType = CourseSchemaType;

interface TemplateSelectProps {
  id: string;
  setValue: UseFormSetValue<FormType>;
  templates: TemplateWithTags[];
}

export default function TemplateSelect({
  id,
  setValue,
  templates,
}: TemplateSelectProps) {
  const template = {
    id: '',
    name: '',
    description: '',
    summary: '',
    tags: [],
    maxStudents: 0,
    createdById: '',
    image: '',
  };

  const { palette } = useTheme();
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateWithTags>(template);

  const handleTemplateChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value as string;
    const templateData =
      templates.find((template) => template.id === selectedId) || template;

    if (templateData) {
      setSelectedTemplate(templateData);

      setValue('name', templateData.name);
      setValue('description', templateData.description);
      setValue('summary', templateData.summary);
      setValue(
        'tags',
        templateData.tags.map((tag) => tag.name)
      );
      setValue('maxStudents', templateData.maxStudents);
      setValue('image', templateData.image);
    }
  };

  return (
    <Box>
      <Select
        labelId={id}
        style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}
        color="secondary"
        onChange={handleTemplateChange}
        value={selectedTemplate.id}
      >
        {templates.map((template) => (
          <MenuItem
            key={template.id}
            value={template.id}
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
            {template.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
