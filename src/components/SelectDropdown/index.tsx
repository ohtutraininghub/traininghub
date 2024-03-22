import { InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Item {
  id: string;
  name: string;
}

interface Props {
  name: string;
  label: string;
  value: string;
  handler: (e: SelectChangeEvent<string>) => void;
  items: Item[];
}

export default function SelectDropdown({
  name,
  label,
  value,
  handler,
  items,
}: Props) {
  return (
    <>
      <InputLabel
        htmlFor={`${name}-select`}
        id={`${name}-label`}
        sx={{ color: 'secondary' }}
      >
        {label}
      </InputLabel>
      <Select
        name={`${name}Select`}
        id={`${name}Select`}
        labelId={`${name}-label`}
        color="secondary"
        value={value}
        onChange={handler}
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
            value={item.name}
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
