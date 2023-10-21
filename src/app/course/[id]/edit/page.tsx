import CourseForm from '@/components/CourseForm/CourseForm';
import { getServerAuthSession } from '@/lib/auth';
import { hasCourseEditRights } from '@/lib/auth-utils';
import { getCourseById } from '@/lib/prisma/courses';
import { getTags } from '@/lib/prisma/tags';
import { notFound, redirect } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export default async function CourseEditPage({ params }: Props) {
  const { user } = await getServerAuthSession();
  const courseId = params.id;
  const tags = await getTags();
  const course = await getCourseById(courseId);

  if (!course) {
    notFound();
  }
  if (!hasCourseEditRights(user, course)) {
    redirect('/');
  }

  return <CourseForm tags={tags} courseData={course} />;
}
