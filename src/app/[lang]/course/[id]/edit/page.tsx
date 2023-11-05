import CourseForm from '@/components/CourseForm/CourseForm';
import { getCourseById } from '@/lib/prisma/courses';
import { getTags } from '@/lib/prisma/tags';
import { Locale } from '@/lib/i18n/i18n-config';
import { notFound } from 'next/navigation';
import BackgroundContainer from '@/components/BackgroundContainer';

type Props = {
  params: {
    id: string;
    lang: Locale;
  };
};

export default async function CourseEditPage({ params }: Props) {
  const courseId = params.id;
  const tags = await getTags();
  const course = await getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return (
    <BackgroundContainer>
      <div style={{ paddingTop: '32px', width: '100%' }}>
        <CourseForm lang={params.lang} tags={tags} courseData={course} />
      </div>
    </BackgroundContainer>
  );
}
