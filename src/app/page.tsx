import CourseList from '@/components/CourseList/CourseList';
import { notFound } from 'next/navigation';
import { getCourses, getEnrolledCourseIdsByUserId } from '@/lib/prisma/courses';
import { getServerAuthSession } from '@/lib/auth';
import CourseViewToggle from '@/components/CourseViewToggle/CourseViewToggle';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: { courseId?: string };
};
export default async function HomePage({ searchParams }: Props) {
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
        backgroundImage: 'url("navbar-wave.svg")',
        backgroundPosition: 'top',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'white',
      }}
    >
      <CourseViewToggle />
      <CourseList
        courses={courses}
        openedCourse={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
      />
    </div>
  );
}
