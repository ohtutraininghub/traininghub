import CourseForm from '@/components/CourseForm/CourseForm';
import { Locale } from '@i18n/i18n-config';
import { getTags } from '@/lib/prisma/tags';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function NewCoursePage({ params }: Props) {
  const tags = await getTags();

  return (
    <>
      <CourseForm lang={params.lang} tags={tags} />
    </>
  );
}
