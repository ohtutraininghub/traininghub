import CourseForm from '@/components/CourseForm/CourseForm';
import CourseList from '@/components/CourseList/CourseList';
import { Typography } from '@mui/material';
import { DictProps } from '@i18n/i18n';
import { getDictionary } from '@i18n/dictionaries';

export default async function HomePage({ lang }: DictProps) {
  const dict = await getDictionary(lang);
  return (
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
      <CourseList />
    </main>
  );
}
