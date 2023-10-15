import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';

export default function EditButton({ courseId }: { courseId: string }) {
  return (
    <Link
      style={{ all: 'unset', display: 'flex', flex: 1 }}
      href={`/course/${courseId}/edit`}
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
        <Typography>Edit course</Typography>
      </Box>
    </Link>
  );
}
