'use client';

import { Box, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

export default function BasicSelect() {
  const { palette } = useTheme();
  const templates = ['test1', 'test2', 'test3'];
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleTemplateChange = (event: SelectChangeEvent) => {
    setSelectedTemplate(event.target.value as string);
  };
  return (
    <Box>
      <Select
        id="template-select"
        style={{ display: 'flex', flexWrap: 'wrap' }}
        color="secondary"
        value={selectedTemplate}
        onChange={handleTemplateChange}
      >
        {templates.map((template) => (
          <MenuItem
            key={1}
            value={template}
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
            {template}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
