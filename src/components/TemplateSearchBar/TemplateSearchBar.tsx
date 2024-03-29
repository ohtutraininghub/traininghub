import React from 'react';
import { DictProps } from '@/lib/i18n';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '@i18n/client';
import { Box } from '@mui/material';

interface TemplateSearchBarProps extends DictProps {
  onSearchTermChange: (searchTerm: string) => void;
}

export function TemplateSearchBar({
  lang,
  onSearchTermChange,
}: TemplateSearchBarProps) {
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');
  const searchBarLabel = t('TemplateSearchBar.Label.text');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchTermChange(event.target.value);
  };

  return (
    <Box display="flex" justifyContent="center">
      <TextField
        variant="outlined"
        label={searchBarLabel}
        size="small"
        sx={{
          width: '97%',
          margin: '10px',
          paddingTop: '10px',
          '& .MuiInputLabel-root': { paddingTop: '10px' },
          '& .MuiInputLabel-root.Mui-focused': {
            color: palette.secondary.main,
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': { borderColor: palette.secondary.main },
          },
        }}
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
        data-testid="TemplateSearchBar"
        onChange={handleSearchChange}
      />
    </Box>
  );
}
