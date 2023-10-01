import { Grid } from '@mui/material';
import { prisma } from '@/lib/prisma';
import CourseCard from '../CourseCard/CourseCard';

const CourseList = async () => {
  const courses = await prisma.course.findMany({
    orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
  });

  return (
    <>
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
};

export default CourseList;
