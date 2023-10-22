import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import { CourseModalCloseButton } from '@/components/Buttons/Buttons';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import EnrollHolder from './EnrollHolder';
import EditButton from './EditButton';
import LocalizedDateTime from '../LocalizedDateTime';

type Props = {
  course: CourseWithTagsAndStudentCount | undefined;
  usersEnrolledCourseIds: string[];
};

export default function CourseModal({ course, usersEnrolledCourseIds }: Props) {
  if (!course) return null;
  const isUserEnrolled = usersEnrolledCourseIds.includes(course.id);
  const isCourseFull = course._count.students === course.maxStudents;

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
          position: 'relative',
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
          backgroundColor: 'secondary.main',
          textAlign: 'center',
        }}
      >
        <CourseModalCloseButton />
        <Typography variant="h3">{course.name}</Typography>
        <Typography sx={{ my: 2 }}>
          <LocalizedDateTime
            variant="range-long"
            startDate={course.startDate}
            endDate={course.endDate}
          />
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          {course.tags.map(({ id, name }) => (
            <Chip
              key={id}
              label={name}
              variant="outlined"
              sx={{ color: 'white.main' }}
            />
          ))}
        </Box>

        <Typography variant="h6" sx={{ my: 2, color: 'white.main' }}>
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
        <Box
          sx={{
            mt: 'auto',
            pt: 3,
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-end' },
            gap: 1,
          }}
        >
          <EditButton courseId={course.id} />
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography sx={{ mb: 1 }}>
              Enrolls: {course._count.students} / {course.maxStudents}
            </Typography>
            <EnrollHolder
              isUserEnrolled={isUserEnrolled}
              courseId={course.id}
              isCourseFull={isCourseFull}
              startDate={course.startDate}
            />
          </Box>
          <Box sx={{ flex: 1 }} />
        </Box>
      </Card>
    </Modal>
  );
}
