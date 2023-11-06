import NewCourseButton from '@/components/Buttons/NewCourseButton';
import NewTagButton from '@/components/Buttons/NewTagButton';
import CourseList from '@/components/CourseList/CourseList';
import { notFound } from 'next/navigation';
import { getCourses, getEnrolledCourseIdsByUserId } from '@/lib/prisma/courses';
import { getServerAuthSession } from '@/lib/auth';
import { isTrainerOrAdmin } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: { courseId?: string };
};

export default async function HomePage({ searchParams }: Props) {
  const { user } = await getServerAuthSession();
  const courses = await getCourses();

  const courseId = searchParams.courseId;
  const openedCourse = courses.find((course) => course.id === courseId);
  if (courseId && !openedCourse) {
    notFound();
  }

  const usersEnrolledCourseIds = await getEnrolledCourseIdsByUserId(user.id);

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
      {isTrainerOrAdmin(user) && (
        <>
          <NewCourseButton />
          <NewTagButton />
        </>
      )}

      <CourseList
        courses={courses}
        openedCourse={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
      />
    </div>
  );
}
