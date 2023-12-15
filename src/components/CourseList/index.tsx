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
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import CourseModal from '@/components/CourseModal';
import { filterCourses } from '@/components/CourseFilter/CourseFilterLogic';
import { useTranslation } from '@i18n/client';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import WindowIcon from '@mui/icons-material/Window';
import { DictProps } from '@/lib/i18n';
import { useTheme } from '@mui/material/styles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import Divider from '@mui/material/Divider';
import LocalizedDateTime from '../LocalizedDateTime';
import Link from 'next/link';
import CourseCard from '@/components/CourseCard';
import { UserNamesAndIds } from '@/lib/prisma/users';
import { ImageContainer } from '../ImageContainer';

interface CourseListProps extends DictProps {
  courses: CourseWithTagsAndStudentCount[];
  openedCourse: CourseWithTagsAndStudentCount | undefined;
  usersEnrolledCourseIds: string[];
  enrolledStudents: UserNamesAndIds | null;
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
  enrolledStudents,
  searchCourses,
  lang,
}: CourseListProps) {
  const filteredCourses = filterCourses(courses, searchCourses);
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

  return (
    <>
      <CourseModal
        lang={lang}
        course={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
        enrolledStudents={enrolledStudents}
        enrolls={t('CourseModal.enrolls', {
          studentCount: openedCourse?._count.students,
          maxStudentCount: openedCourse?.maxStudents,
        })}
        editCourseLabel={t('EditButton.editCourse')}
      />
      <div style={{ paddingTop: '1em' }}>
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
              container
              spacing={2}
              maxWidth={1600}
              width="100%"
              sx={{ margin: 'auto' }}
              columns={{ xs: 1, sm: 2, md: 3 }}
            >
              {filteredCourses.map((course) => (
                <Grid key={course.id} item xs={1} sx={{ marginBottom: '50px' }}>
                  <CourseCard
                    lang={lang}
                    enrolls={t('CourseCard.enrolls', {
                      studentCount: course._count.students,
                      maxStudentCount: course.maxStudents,
                    })}
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
              <List>
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
                              <LocalizedDateTime
                                variant="range-short"
                                startDate={course.startDate}
                                endDate={course.endDate}
                              />
                              <br />
                              <PeopleIcon
                                sx={{
                                  fontSize: '0.9rem',
                                  marginRight: '8px',
                                  display: 'inline',
                                }}
                              />
                              {t('CourseListView.enrolls', {
                                studentCount: course._count.students,
                                maxStudentCount: course.maxStudents,
                              })}
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
