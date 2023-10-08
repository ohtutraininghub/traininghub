import CourseForm from '@/components/CourseForm/CourseForm';
import CourseList from '@/components/CourseList/CourseList';
import { notFound } from 'next/navigation';
import { getCourses } from '@/lib/prisma/courses';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: { courseId?: string };
};
export default async function HomePage({ searchParams }: Props) {
  const courses = await getCourses();

  const courseId = searchParams.courseId;
  const openedCourse = courses.find((course) => course.id === courseId);
  if (courseId && !openedCourse) {
    notFound();
  }

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
      <CourseList courses={courses} openedCourse={openedCourse} />
    </div>
  );
}
