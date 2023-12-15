'use client';

import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Link from 'next/link';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import LocalizedDateTime from '../LocalizedDateTime';
import { useTheme } from '@mui/material/styles';
import { Box, Button, useMediaQuery } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/client';
import { DictProps } from '@/lib/i18n';
import { ImageContainer } from '../ImageContainer';

interface Props extends DictProps {
  course: CourseWithTagsAndStudentCount;
  enrolls: string;
}

const CourseCard = ({ course, enrolls, lang }: Props) => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { t } = useTranslation(lang, 'components');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getURL = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('courseId', course.id);
    return `${pathname}?${params.toString()}`;
  };
  return (
    <Link href={getURL()} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          backgroundColor: theme.palette.coverBlue.dark,
          color: theme.palette.white.main,
          width: 450, // fixed dimensions for styling
          minHeight: 300,
          /* allow expanding in height in mobile view if needed to display
           course image and summary on very narrow viewports */
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
          sx={{ paddingBottom: !course.image ? '1rem' : 0 }}
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
          <Typography variant="h3">{course.name}</Typography>

          {course.image && (
            <ImageContainer
              imageUrl={course.image}
              width={isMobile ? 100 : 125}
              height={isMobile ? 100 : 125}
              altText={t('CourseModal.courseImageAltText')}
            />
          )}

          {course.summary && (
            <Typography
              variant="body1"
              width="90%"
              color="surface.light"
              sx={{
                textShadow: '1px 1px 1px black',
              }}
            >
              {course.summary}
            </Typography>
          )}
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
