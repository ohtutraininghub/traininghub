import { Grid, Typography } from '@mui/material';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import CourseModal from '@/components/CourseModal/CourseModal';
import { DictProps, useTranslation } from '@/lib/i18n';
import CourseCard from '../CourseCard';

interface CourseListProps extends DictProps {
  courses: CourseWithTagsAndStudentCount[];
  openedCourse: CourseWithTagsAndStudentCount | undefined;
  usersEnrolledCourseIds: string[];
}

export default async function CourseList({
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
      <Typography variant="h4">{t('CourseList.courses')}</Typography>
      <Grid
        container
        spacing={2}
        maxWidth={1200}
        width="100%"
        sx={{ margin: 'auto' }}
        columns={{ xs: 1, sm: 2, md: 3 }}
      >
        {courses.map((course) => (
          <Grid key={course.id} item xs={1}>
            <CourseCard
              enrolls={t('CourseCard.enrolls', {
                studentCount: course._count.students,
                maxStudentCount: course.maxStudents,
              })}
              course={course}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
