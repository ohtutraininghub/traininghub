import CourseList from '@/components/CourseList/CourseList';
import { notFound } from 'next/navigation';
import { getCourses, getEnrolledCourseIdsByUserId } from '@/lib/prisma/courses';
import { getServerAuthSession } from '@/lib/auth';
import CourseViewToggle from '@/components/CourseViewToggle/CourseViewToggle';
import { Locale } from '@/lib/i18n/i18n-config';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: { courseId?: string };
  params: {
    lang: Locale;
  };
};
export default async function HomePage({ searchParams, params }: Props) {
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
        backgroundColor: '#00607e',
        height: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0px 16px 100px 16px',
          backgroundImage: 'url("navbar-wave-s.svg")',
          backgroundPosition: 'top',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#00607e',
        }}
      >
        <CourseViewToggle />
        <CourseList
          lang={params.lang}
          courses={courses}
          openedCourse={openedCourse}
          usersEnrolledCourseIds={usersEnrolledCourseIds}
        />
      </div>
    </div>
  );
}
