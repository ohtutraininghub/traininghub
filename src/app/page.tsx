import NewCourseButton from '@/components/Buttons/NewCourseButton';
import CourseList from '@/components/CourseList/CourseList';
import { notFound } from 'next/navigation';
import { getCourses, getEnrolledCourseIdsByUserId } from '@/lib/prisma/courses';
import { getServerAuthSession } from '@/lib/auth';

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
      }}
    >
      <h2>Actions</h2>
      <NewCourseButton />
      <CourseList
        courses={courses}
        openedCourse={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
      />
    </div>
  );
}
