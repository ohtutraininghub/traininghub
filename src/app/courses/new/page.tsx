import CourseForm from '@/components/CourseForm/CourseForm';
import { prisma } from '@/lib/prisma/prisma';

export const dynamic = 'force-dynamic';

export default async function NewCoursePage() {
  const tags = await prisma.tag.findMany();

  return (
    <>
      <CourseForm tags={tags} />
    </>
  );
}
