import React from 'react';
import { DictProps } from '@/lib/i18n';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

interface TemplateSearchBarProps extends DictProps {}

export function TemplateSearchBar({}: TemplateSearchBarProps) {
  const { palette } = useTheme();

  return (
    <TextField
      variant="outlined"
      label="Search templates by name or creator"
      sx={{
        width: '50%',
        margin: '10px',
        // Override the styles for the InputLabel when focused
        '& .MuiInputLabel-root.Mui-focused': {
          color: palette.secondary.main,
        },
        // Override the styles for the Input's underline and outline when focused
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: palette.secondary.main,
          },
        },
      }}
      InputProps={{
        startAdornment: <SearchIcon />,
      }}
    />
  );
}
