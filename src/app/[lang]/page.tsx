import CourseForm from '@/components/CourseForm/CourseForm';
import CourseList from '@/components/Buttons/CourseList/CourseList';
import { Typography } from '@mui/material';
import { getDictionary } from '@i18n/dictionaries';
import { prisma } from '@/lib/prisma';
import { Locale } from '@/lib/i18n/i18n-config';

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function HomePage({ params: { lang } }: Props) {
  const courses = await prisma.course.findMany({
    orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
  });
  const dict = await getDictionary(lang);
  return (
    <>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0px 16px 100px 16px',
        }}
      >
        <Typography variant="h2">{dict.HomePage.trainingListTitle}</Typography>
        <CourseForm lang={lang} />
        <CourseList lang={lang} courses={courses} />
      </main>
    </>
  );
}
