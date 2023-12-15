import CourseForm from '@/components/CourseForm';
import { Locale } from '@i18n/i18n-config';
import { getTags } from '@/lib/prisma/tags';
import BackgroundContainer from '@/components/BackgroundContainer';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function NewCoursePage({ params }: Props) {
  const tags = await getTags();

  return (
    <BackgroundContainer>
      <div style={{ paddingTop: '32px', width: '100%' }}>
        <CourseForm lang={params.lang} tags={tags} />
      </div>
    </BackgroundContainer>
  );
}
