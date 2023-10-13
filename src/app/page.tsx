import { notFound } from 'next/navigation';
import { getCourses, getEnrolledCourseIdsByUserId } from '@/lib/prisma/courses';
import { getServerAuthSession } from '@/lib/auth';
import CourseFilter from '@/components/CourseFilter/CourseFilter';
import CourseForm from '@/components/CourseForm/CourseForm';
import { prisma } from '@/lib/prisma/prisma';

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

  const tags = await prisma.tag.findMany({});

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
      <h2>Add new Course</h2>
      <CourseForm />
      <CourseFilter
        initialCourses={courses}
        initialTags={tags}
        openedCourse={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
      />
    </div>
  );
}
