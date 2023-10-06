'use client';

import { Grid } from '@mui/material';
import CourseCard from '../CourseCard/CourseCard';
import { Prisma } from '@prisma/client';

type CoursePrismaType = Prisma.CourseGetPayload<Prisma.CourseDefaultArgs>;

type CourseListProps = {
  courses: CoursePrismaType[];
};

export default function CourseList({ courses }: CourseListProps) {
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
}
