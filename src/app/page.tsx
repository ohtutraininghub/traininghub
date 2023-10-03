import NewCourseButton from '@/components/Buttons/NewCourseButton';
import CourseList from '@/components/CourseList/CourseList';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const courses = await prisma.course.findMany({
    orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
  });

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
      <h2>Actions -- placeholder</h2>
      <NewCourseButton />
      <CourseList courses={courses} />
    </div>
  );
}
