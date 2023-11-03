'use client';

import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Link from 'next/link';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import LocalizedDateTime from '../LocalizedDateTime';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';

interface Props {
  course: CourseWithTagsAndStudentCount;
  enrolls: string;
}

const CourseCard = ({ course, enrolls }: Props) => {
  const theme = useTheme();

  return (
    <Link href={`?courseId=${course.id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          backgroundColor: theme.palette.coverBlue.dark,
          color: theme.palette.white.main,
          width: 450, // fixed dimensions for styling
          height: '300px',
          [theme.breakpoints.up('sm')]: {
            height: '540px',
          },
          maxWidth: '100%',
          borderRadius: '20px',
          margin: 'auto',
          textAlign: 'center',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.9)',
        }}
      >
        <CardHeader
          title={
            <LocalizedDateTime
              variant="range-short"
              startDate={course.startDate}
              endDate={course.endDate}
            />
          }
          titleTypographyProps={{
            style: {
              color: theme.palette.white.main,
              fontSize: '16px',
            },
          }}
        />
        <CardContent sx={{ overflowWrap: 'break-word' }}>
          <Typography>{enrolls}</Typography>

          <Typography variant="h5" m={2}>
            {course.name}
          </Typography>

          <Button
            variant="contained"
            sx={{
              width: '180px', // fixed dimensions for styling
              height: '50px',
              fontSize: '16px',
              fontWeight: 450,
              borderRadius: '13px',
              boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.7)',
            }}
          >
            Learn more
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
