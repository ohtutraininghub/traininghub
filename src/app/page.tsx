import CourseForm from '@/components/CourseForm/CourseForm';
import CourseList from '@/components/CourseList/CourseList';
import { notFound } from 'next/navigation';
import { getCourses, getEnrolledCourseIdsByUserId } from '@/lib/prisma/courses';
import { getServerAuthSession } from '@/lib/auth';
import Link from 'next/link';
import Button from '@mui/material/Button';

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
      <Link href="/admin/create-tag">
        <Button color="secondary" variant="contained">
          Add New Tag
        </Button>
      </Link>

      <h2>Add new Course</h2>
      <CourseForm />
      <CourseList
        courses={courses}
        openedCourse={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
      />
    </div>
  );
}
