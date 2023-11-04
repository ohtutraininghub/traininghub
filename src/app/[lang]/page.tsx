import CourseList from '@/components/CourseList/CourseList';
import { notFound } from 'next/navigation';
import { getCourses, getEnrolledCourseIdsByUserId } from '@/lib/prisma/courses';
import { getServerAuthSession } from '@/lib/auth';
import CourseViewToggle from '@/components/CourseViewToggle/CourseViewToggle';
import { Locale } from '@/lib/i18n/i18n-config';
import BackgroundContainer from '@/components/BackgroundContainer';
import TemporaryListView from '@/components/CourseList/TemporaryListView';
import SpeedDialMenu from '@/components/SpeedDialMenu';

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
    <BackgroundContainer>
      <CourseViewToggle />
      <SpeedDialMenu />
      <CourseList
        lang={params.lang}
        courses={courses}
        openedCourse={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
      />
      <TemporaryListView
        courses={courses}
        openedCourse={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
        lang={params.lang}
      />
    </BackgroundContainer>
  );
}
