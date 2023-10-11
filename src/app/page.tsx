import CourseForm from '@/components/CourseForm/CourseForm';
import CourseList from '@/components/CourseList/CourseList';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const courses = await prisma.course.findMany({
    orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
    where: { endDate: { gte: new Date() } },
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
      <h2>Add new Course</h2>
      <CourseForm />
      <CourseList courses={courses} />
    </div>
  );
}
