import { Box, List, ListItem, ListItemText } from '@mui/material';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import CourseModal from '../CourseModal/CourseModal';
import { DictProps, useTranslation } from '@/lib/i18n';

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

      <Box>
        <List>
          {courses.map((course) => (
            <ListItem key={course.id}>
              <ListItemText
                primary={course.name}
                primaryTypographyProps={{ style: { color: 'white' } }}
                secondary={`Start Date: ${course.startDate}, Students: ${course._count.students}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
