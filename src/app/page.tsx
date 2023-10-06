import CourseForm from '@/components/CourseForm/CourseForm';
import CourseFilter from '@/components/CourseFilter';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
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
      <CourseFilter />
    </div>
  );
}
