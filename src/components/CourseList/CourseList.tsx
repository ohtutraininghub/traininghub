import { Grid, Typography } from '@mui/material';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import CourseCard from '@/components/CourseCard/';
import CourseModal from '@/components/CourseModal/CourseModal';
import { DictProps, useTranslation } from '@/lib/i18n';

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
  const { t } = await useTranslation(lang);
  return (
    <>
      <CourseModal
        course={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
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
            <CourseCard course={course} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
