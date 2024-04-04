import React from 'react';
import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Item {
  id: string;
  name: string;
}

interface Props {
  label: string;
  items: Item[];
  field: {
    onChange: (e: SelectChangeEvent) => void;
    onBlur: () => void;
    value: string;
    name: string;
  };
}

const SelectDropdown = React.forwardRef<HTMLDivElement, Props>(
  function SelectDropdown({ label, items, field }, ref) {
    return (
      <>
        <InputLabel
          htmlFor={`${field.name}-select`}
          id={`${field.name}-label`}
          sx={{ color: 'secondary' }}
        >
          {label}
        </InputLabel>
        <Select
          {...field}
          label={label}
          ref={ref}
          name={`${field.name}Select`}
          id={`${field.name}-select`}
          labelId={`${field.name}-label`}
          color="secondary"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: 2,
          }}
          MenuProps={{ disableScrollLock: true }}
        >
          {items.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
              divider
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'surface.main',
                },
                '&.Mui-selected.Mui-focusVisible': {
                  backgroundColor: 'surface.dark',
                },
                '&:hover': {
                  backgroundColor: 'surface.light',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'surface.main',
                },
              }}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </>
    );
  }
);

export default SelectDropdown;
