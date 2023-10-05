import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Link from 'next/link';
import { Course } from '@prisma/client';
import { getCourseDateString } from '@/lib/util';

type Props = {
  course: Course;
};

const CourseCard = ({ course }: Props) => {
  const courseDate = getCourseDateString(course);

  return (
    <Link href={`/?courseId=${course.id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          backgroundColor: 'darkBlue.main',
          color: 'white.main',
          width: 340,
          maxWidth: '100%',
          borderRadius: '15px',
          margin: 'auto',
          textAlign: 'center',
        }}
      >
        <CardContent sx={{ overflowWrap: 'break-word' }}>
          <Typography variant="h5" m={2}>
            {course.name}
          </Typography>
          <Typography>{courseDate}</Typography>
          <Typography>Signups: 0 / {course.maxStudents}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
