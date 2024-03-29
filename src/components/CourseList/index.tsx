'use client';

import * as React from 'react';
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { CourseWithInfo } from '@/lib/prisma/courses';
import CourseModal from '@/components/CourseModal';
import { filterCourses } from '@/components/CourseFilter/CourseFilterLogic';
import { useTranslation } from '@i18n/client';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import WindowIcon from '@mui/icons-material/Window';
import { DictProps } from '@/lib/i18n';
import { useTheme } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Divider from '@mui/material/Divider';
import LocalizedDateTime from '../LocalizedDateTime';
import Link from 'next/link';
import CourseCard from '@/components/CourseCard';
import { UserNamesAndIds } from '@/lib/prisma/users';
import { ImageContainer } from '../ImageContainer';
import { ToggleTrainingsButton } from '../Buttons/Buttons';
import { RequestsAndUserNames } from '@/lib/prisma/requests';

interface CourseListProps extends DictProps {
  courses: CourseWithInfo[];
  openedCourse: CourseWithInfo | undefined;
  usersEnrolledCourseIds?: string[];
  usersRequestedCourseIds?: string[];
  enrolledStudents?: UserNamesAndIds;
  requests?: RequestsAndUserNames;
  searchCourses: {
    courseName?: string;
    courseTag?: string;
    startDate?: string;
    endDate?: string;
  };
}

export default function CourseList({
  courses,
  openedCourse,
  usersEnrolledCourseIds,
  usersRequestedCourseIds,
  enrolledStudents,
  requests,
  searchCourses,
  lang,
}: CourseListProps) {
  const [showPastCourses, setShowPastCourses] = React.useState(false);
  const filteredCourses = filterCourses(
    courses,
    searchCourses,
    showPastCourses
  );
  const { t } = useTranslation(lang, 'components');
  const { palette } = useTheme();
  const [viewStyle, setViewStyle] = React.useState<string | null>('grid');

  const handleViewToggle = (
    // eslint-disable-next-line
    event: React.MouseEvent<HTMLElement>,
    newViewStyle: string | null
  ) => {
    if (newViewStyle !== null) {
      setViewStyle(newViewStyle);
    }
  };

  const handleToggleRequestTrainings = () => {
    setShowPastCourses(!showPastCourses);
  };

  const studentCount = (course: CourseWithInfo) => {
    if (!showPastCourses) {
      return t('CourseModal.enrolls', {
        studentCount: course._count.students,
        maxStudentCount: course.maxStudents,
      });
    }
    return t('CourseModal.requests', {
      requestCount: course._count.requests,
    });
  };

  return (
    <>
      <CourseModal
        lang={lang}
        course={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
        usersRequestedCourseIds={usersRequestedCourseIds}
        enrolledStudents={enrolledStudents}
        requests={requests}
      />
      <Grid
        container
        display="flex"
        width="100%"
        maxWidth={1600}
        alignItems="center"
      >
        <Grid item xs={0} sm={4}></Grid>
        <Grid item xs={6} sm={4} display={'flex'} flexDirection={'column'}>
          <div
            style={{
              paddingTop: '1em',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <ToggleButtonGroup
              value={viewStyle}
              exclusive
              onChange={handleViewToggle}
              aria-label="course view style"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <WindowIcon style={{ color: palette.white.main }} />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewHeadlineIcon style={{ color: palette.white.main }} />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '1em',
            }}
          >
            <Typography
              variant="caption"
              style={{
                fontWeight: 500,
                textTransform: 'uppercase',
                color: palette.white.main,
                marginRight: '20px',
              }}
            >
              {t('CourseList.gridControlLabel')}
            </Typography>
            <Typography
              variant="caption"
              style={{
                fontWeight: 500,
                color: palette.white.main,
                textTransform: 'uppercase',
              }}
            >
              {t('CourseList.listControlLabel')}
            </Typography>
          </div>
        </Grid>
        <Grid
          item
          xs={6}
          display="flex"
          justifyContent="flex-end"
          sx={{
            pr: { xs: '2rem', sm: '2rem', xl: '4rem' },
            mb: '1rem',
            flex: { xs: 1, sm: 1 },
          }}
        >
          <ToggleTrainingsButton
            text={
              showPastCourses
                ? t('ToggleTrainingsButton.currentTrainings')
                : t('ToggleTrainingsButton.requestTrainings')
            }
            onClick={handleToggleRequestTrainings}
          />
        </Grid>
      </Grid>
      {filteredCourses.length === 0 ? (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 500px)',
          }}
        >
          <Typography
            variant="h4"
            style={{
              color: palette.white.main,
            }}
          >
            {t('CourseList.noCoursesToShow')}
          </Typography>
        </Box>
      ) : (
        <>
          {viewStyle === 'grid' && (
            <Grid
              data-testid="grid-view"
              container
              maxWidth={1600}
              width="100%"
              sx={{ margin: 'auto' }}
              columns={{ xs: 1, sm: 2, md: 3 }}
            >
              {filteredCourses.map((course) => (
                <Grid
                  key={course.id}
                  item
                  xs={1}
                  sx={{
                    marginBottom: '50px',
                    padding: '8px',
                    paddingBottom: '0px',
                  }}
                >
                  <CourseCard
                    data-testid="course-card"
                    lang={lang}
                    studentCount={studentCount(course)}
                    course={course}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          {viewStyle === 'list' && (
            <Box
              style={{
                background: 'rgba(0, 0, 0, 0.1)',
                padding: '0px',
                maxWidth: 1300,
                width: '100%',
              }}
            >
              <List data-testid="list-view">
                {filteredCourses.map((course, index) => (
                  <div key={course.id}>
                    <Link
                      href={`?courseId=${course.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <ListItem
                        sx={{
                          background: 'rgba(0, 0, 0, 0.2)',
                          marginBottom: '10px',
                          transition: 'background-color 0.3s',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRight: '15px dashed #ffd100',
                          },
                          paddingLeft: !!course.image ? 0 : 'auto',
                        }}
                      >
                        {course.image && (
                          <ListItemIcon>
                            <ImageContainer
                              imageUrl={course.image}
                              width={75}
                              height={75}
                              altText={t('CourseModal.courseImageAltText')}
                            />
                          </ListItemIcon>
                        )}
                        <ListItemText
                          primary={course.name}
                          primaryTypographyProps={{
                            style: {
                              color: palette.white.main,
                              fontSize: '18px',
                              fontWeight: 400,
                              marginBottom: '10px',
                            },
                          }}
                          secondary={
                            <span
                              style={{ marginBottom: '8px', display: 'block' }}
                            >
                              <CalendarTodayIcon
                                sx={{
                                  fontSize: '0.8rem',
                                  marginRight: '8px',
                                  display: 'inline',
                                }}
                              />
                              {!showPastCourses ? (
                                <LocalizedDateTime
                                  variant="range-short"
                                  startDate={course.startDate}
                                  endDate={course.endDate}
                                />
                              ) : (
                                t('CourseCard.expired')
                              )}
                              <br />
                              {!showPastCourses ? (
                                <PeopleIcon
                                  sx={{
                                    fontSize: '0.9rem',
                                    marginRight: '8px',
                                    display: 'inline',
                                  }}
                                />
                              ) : (
                                <HowToRegIcon
                                  sx={{
                                    fontSize: '0.9rem',
                                    marginRight: '8px',
                                    display: 'inline',
                                  }}
                                />
                              )}
                              {studentCount(course)}
                            </span>
                          }
                          secondaryTypographyProps={{
                            style: {
                              color: palette.white.main,
                            },
                          }}
                        />
                      </ListItem>
                      {index < courses.length - 1 && <Divider />}
                    </Link>
                  </div>
                ))}
              </List>
            </Box>
          )}
        </>
      )}
    </>
  );
}
