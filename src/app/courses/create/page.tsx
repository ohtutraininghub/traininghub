import CourseForm from '@/components/CourseForm/CourseForm';
import { getTags } from '@/lib/prisma/tags';

export const dynamic = 'force-dynamic';

export default async function NewCoursePage() {
  const tags = await getTags();

  return (
    <>
      <CourseForm tags={tags} />
    </>
  );
}
