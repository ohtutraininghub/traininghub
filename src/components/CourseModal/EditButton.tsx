import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';

export default function EditButton({ courseId }: { courseId: string }) {
  return (
    <Link style={{ all: 'unset' }} href={`/course/${courseId}/edit`}>
      <Box
        sx={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          display: 'flex',
          flexDirection: 'column',
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
