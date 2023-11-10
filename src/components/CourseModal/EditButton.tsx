import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  courseId: string;
  editCourseLabel: string;
  hidden: boolean;
}

export default function EditButton({
  courseId,
  editCourseLabel,
  hidden,
}: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
      }}
    >
      <Link
        style={{ textDecoration: 'none', color: 'inherit' }}
        href={`/course/${courseId}/edit`}
        hidden={hidden}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row-reverse', sm: 'column' },
            alignItems: 'center',
            width: 'fit-content',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
              color: 'info.main',
            },
          }}
        >
          <EditIcon />
          <Typography>{editCourseLabel}</Typography>
        </Box>
      </Link>
    </Box>
  );
}
