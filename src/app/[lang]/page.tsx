import NewCourseButton from '@/components/Buttons/NewCourseButton';
import NewTagButton from '@/components/Buttons/NewTagButton';
import CourseList from '@/components/CourseList/CourseList';
import { notFound } from 'next/navigation';
import { getCourses, getEnrolledCourseIdsByUserId } from '@/lib/prisma/courses';
import { getServerAuthSession } from '@/lib/auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { useTranslation } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: { courseId?: string };
  params: {
    lang: Locale;
  };
};
export default async function HomePage({ searchParams, params }: Props) {
  const { t } = await useTranslation(params.lang);
  const session = await getServerAuthSession();
  const courses = await getCourses();

  const courseId = searchParams.courseId;
  const openedCourse = courses.find((course) => course.id === courseId);
  if (courseId && !openedCourse) {
    notFound();
  }

  const usersEnrolledCourseIds = await getEnrolledCourseIdsByUserId(
    session.user.id
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px 16px 100px 16px',
      }}
    >
<<<<<<< HEAD:src/app/page.tsx
      <NewCourseButton />
      <NewTagButton />
=======
      <h2>{t('HomePage.trainingListTitle')}</h2>
      <CourseForm lang={params.lang} />
>>>>>>> f8f8ae7 (Add internalization settings and initial locales):src/app/[lang]/page.tsx
      <CourseList
        lang={params.lang}
        courses={courses}
        openedCourse={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
      />
    </div>
  );
}
