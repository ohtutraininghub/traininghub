import CourseForm from '@/components/CourseForm/CourseForm';
import { Locale } from '@/lib/i18n/i18n-config';
import { getTags } from '@/lib/prisma/tags';

interface Props {
  params: {
    lang: Locale;
  };
}

export const dynamic = 'force-dynamic';

export default async function NewCoursePage({ params }: Props) {
  const tags = await getTags();

  return (
    <>
      <CourseForm lang={params.lang} tags={tags} />
    </>
  );
}
