import { FormHelperText } from '@mui/material';
import { FieldError } from 'react-hook-form';

type Props = {
  error: FieldError | undefined;
};

const FormFieldError = ({ error }: Props) => {
  if (!error) return null;
  return (
    <FormHelperText sx={{ color: 'error.main' }}>
      {error.message}
    </FormHelperText>
  );
};

export default FormFieldError;
