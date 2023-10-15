import CourseForm from '@/components/CourseForm/CourseForm';
import { getCourseById, getTags } from '@/lib/prisma/courses';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export default async function CourseEditPage({ params }: Props) {
  const courseId = params.id;
  const tags = await getTags();
  const course = await getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return <CourseForm tags={tags} courseData={course} />;
}
