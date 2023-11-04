import { Grid } from '@mui/material';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import CourseModal from '@/components/CourseModal/CourseModal';
import { filterCourses } from '@/components/CourseFilter/CourseFilterLogic';
import { DictProps, useTranslation } from '@/lib/i18n';
import CourseCard from '../CourseCard';

interface CourseListProps extends DictProps {
  courses: CourseWithTagsAndStudentCount[];
  openedCourse: CourseWithTagsAndStudentCount | undefined;
  usersEnrolledCourseIds: string[];
  searchCourses: {
    courseName?: string;
    courseTag?: string;
    courseDates?: string;
  };
}

export default async function CourseList({
  courses,
  openedCourse,
  usersEnrolledCourseIds,
  searchCourses,
  lang,
}: CourseListProps) {
  const filteredCourses = filterCourses(courses, searchCourses);
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
