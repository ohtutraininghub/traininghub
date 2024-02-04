import CourseForm from '@/components/CourseForm';
import { Locale } from '@i18n/i18n-config';
import { getTags } from '@/lib/prisma/tags';
import { getTemplatesByUserId } from '@/lib/prisma/templates';
import { getServerAuthSession } from '@/lib/auth';
import BackgroundContainer from '@/components/BackgroundContainer';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function NewCoursePage({ params }: Props) {
  const session = await getServerAuthSession();
  const tags = await getTags();
  const userId = session.user.id;
  const templates = await getTemplatesByUserId(userId);

  return (
    <BackgroundContainer>
      <div style={{ paddingTop: '32px', width: '100%' }}>
        <CourseForm lang={params.lang} tags={tags} templates={templates} />
      </div>
    </BackgroundContainer>
  );
}
