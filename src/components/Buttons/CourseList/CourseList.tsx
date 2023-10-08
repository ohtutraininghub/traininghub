import { Grid } from '@mui/material';
import { Prisma } from '@prisma/client';
import CourseCard from '../../CourseCard/CourseCard';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { DictProps } from '@/lib/i18n/i18n';

type CoursePrismaType = Prisma.CourseGetPayload<Prisma.CourseDefaultArgs>;

interface CourseListProps extends DictProps {
  courses: CoursePrismaType[];
}

export default async function CourseList({ courses, lang }: CourseListProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <h1>{dict.CourseList.courses}</h1>
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
            <CourseCard course={course} lang={lang} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
