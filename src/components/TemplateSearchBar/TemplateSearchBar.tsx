import React from 'react';
import { DictProps } from '@/lib/i18n';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '@i18n/client';

interface TemplateSearchBarProps extends DictProps {}

export function TemplateSearchBar({ lang }: TemplateSearchBarProps) {
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');
  const searchBarLabel = t('TemplateSearchBar.Label.text');
  return (
    <TextField
      variant="outlined"
      label={searchBarLabel}
      size="small"
      sx={{
        width: '97%',
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
      data-testid="TemplateSearchBar"
    />
  );
}
