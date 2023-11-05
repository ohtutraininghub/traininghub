'use client';

import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Link from 'next/link';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import LocalizedDateTime from '../LocalizedDateTime';
import { useTheme } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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
            // adjust to smaller card size for mobile
            height: '540px',
          },
          maxWidth: '100%',
          borderRadius: '20px',
          margin: 'auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `url('/course-card-bg-default.png')`,
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.9)',
        }}
      >
        <CardHeader
          title={
            <Box>
              <CalendarTodayIcon
                sx={{ fontSize: '0.8rem', marginRight: '8px' }}
              />
              <LocalizedDateTime
                variant="range-short"
                startDate={course.startDate}
                endDate={course.endDate}
              />
            </Box>
          }
          titleTypographyProps={{
            style: {
              color: theme.palette.white.main,
              fontSize: '16px',
            },
          }}
        />
        <CardContent
          sx={{
            overflowWrap: 'break-word',
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h5" m={2}>
              {course.name}
            </Typography>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <Box
                sx={{
                  display: { xs: 'none', sm: 'block' }, // no render for too small viewports to save space for title
                }}
              >
                <PeopleIcon />
                <Typography>{enrolls}</Typography>
              </Box>
            </Box>
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
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
