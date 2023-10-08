import { Grid } from '@mui/material';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import CourseCard from '@/components/CourseCard/';
import CourseModal from '@/components/CourseModal/CourseModal';

type CourseListProps = {
  courses: CourseWithTagsAndStudentCount[];
  openedCourse: CourseWithTagsAndStudentCount | undefined;
};

export default async function CourseList({
  courses,
  openedCourse,
}: CourseListProps) {
  return (
    <>
      <CourseModal course={openedCourse} />
      <h1>Courses</h1>
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
