import { Box, List, ListItem, ListItemText } from '@mui/material';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import CourseModal from '../CourseModal/CourseModal';
import { DictProps, useTranslation } from '@/lib/i18n';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import Divider from '@mui/material/Divider';
import LocalizedDateTime from '../LocalizedDateTime';

interface CourseListProps extends DictProps {
  courses: CourseWithTagsAndStudentCount[];
  openedCourse: CourseWithTagsAndStudentCount | undefined;
  usersEnrolledCourseIds: string[];
}

export default async function TemporaryListView({
  courses,
  openedCourse,
  usersEnrolledCourseIds,
  lang,
}: CourseListProps) {
  const { t } = await useTranslation(lang, 'components');

  return (
    <>
      <CourseModal
        lang={lang}
        course={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
        enrolls={t('CourseModal.enrolls', {
          studentCount: openedCourse?._count.students,
          maxStudentCount: openedCourse?.maxStudents,
        })}
        description={t('CourseModal.description')}
        editCourseLabel={t('EditButton.editCourse')}
      />

      <Box
        style={{
          background: 'rgba(0, 0, 0, 0.1)',
          padding: '0px',
          maxWidth: 1300,
          width: '100%',
        }}
      >
        <List>
          {courses.map((course, index) => (
            <div key={course.id}>
              <ListItem
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  marginBottom: '10px',
                }}
              >
                <ListItemText
                  primary={course.name}
                  primaryTypographyProps={{
                    style: {
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 400,
                      marginBottom: '10px',
                    },
                  }}
                  secondary={
                    <span style={{ marginBottom: '8px', display: 'block' }}>
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
                      Enrolls {course._count.students}
                    </span>
                  }
                  secondaryTypographyProps={{
                    style: {
                      color: 'white',
                    },
                  }}
                />
              </ListItem>
              {index < courses.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </Box>
    </>
  );
}
