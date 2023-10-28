import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Link from 'next/link';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import LocalizedDateTime from '../LocalizedDateTime';

interface Props {
  course: CourseWithTagsAndStudentCount;
  enrolls: string;
}

const CourseCard = ({ course, enrolls }: Props) => {
  return (
    <Link href={`?courseId=${course.id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          backgroundColor: 'secondary.main',
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
          <Typography>
            <LocalizedDateTime
              variant="range-short"
              startDate={course.startDate}
              endDate={course.endDate}
            />
          </Typography>
          <Typography>{enrolls}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
