import CourseForm from '@/components/CourseForm/CourseForm';
import { getTags } from '@/lib/prisma/courses';
import { prisma } from '@/lib/prisma/prisma';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export default async function CourseEditPage({ params }: Props) {
  const courseId = params.id;
  const tags = await getTags();
  const course = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!course) {
    notFound();
  }

  return <CourseForm tags={tags} courseData={course} />;
}
