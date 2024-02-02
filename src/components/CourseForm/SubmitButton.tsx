import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props {
  isEditMode: boolean;
  isSubmitting: boolean;
}
export default function SubmitButton({ isEditMode, isSubmitting }: Props) {
  const { palette } = useTheme();
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
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
      data-testid="courseFormSubmit"
    >
      {isEditMode ? 'Update' : 'Submit'}
    </Button>
  );
}
