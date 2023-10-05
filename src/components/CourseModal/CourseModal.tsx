import { Course } from '@prisma/client';
import { CourseModalCloseButton } from '@/components/Buttons/Buttons';
import { getCourseDateString } from '@/lib/util';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const placeholderTags = [
  { name: 'Golang' },
  { name: 'UX/UI' },
  { name: 'System Design' },
];

type Props = {
  course: Course | undefined;
};

export default function CourseModal({ course }: Props) {
  if (!course) return null;
  const courseDate = getCourseDateString(course);

  return (
    <Modal
      open
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '1000px',
          height: '900px',
          maxWidth: '100%',
          maxHeight: '100%',
          overflow: 'auto',
          overflowWrap: 'break-word',
          borderRadius: '10px',
          m: 2,
          p: 3,
          color: 'white.main',
          backgroundColor: 'darkBlue.main',
          textAlign: 'center',
        }}
      >
        <CourseModalCloseButton />
        <Typography variant="h3">{course.name}</Typography>
        <Typography sx={{ my: 2 }}>{courseDate}</Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          {placeholderTags.map(({ name }) => (
            <Chip
              key={name}
              label={name}
              variant="outlined"
              sx={{ color: 'white.main' }}
            />
          ))}
        </Box>

        <Typography sx={{ my: 2, color: 'secondary.main', textAlign: 'start' }}>
          Description
        </Typography>

        <pre
          style={{
            whiteSpace: 'pre-wrap',
            margin: 0,
            textAlign: 'start',
            paddingRight: '16px',
            overflow: 'auto',
          }}
        >
          <Typography>{course.description}</Typography>
        </pre>

        <Box sx={{ mt: 'auto', pt: 3 }}>
          <Typography>Signups: 0 / {course.maxStudents}</Typography>
          <Button>Signup</Button>
        </Box>
      </Card>
    </Modal>
  );
}
