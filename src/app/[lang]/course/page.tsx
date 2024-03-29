import React from 'react';
import CourseForm from '@/components/CourseForm';
import { getServerAuthSession } from '@/lib/auth';
import { hasCourseEditRights } from '@/lib/auth-utils';
import { getCourseById } from '@/lib/prisma/courses';
import { getTags } from '@/lib/prisma/tags';
import { notFound, redirect } from 'next/navigation';
import { Locale } from '@/lib/i18n/i18n-config';

type Props = {
  params: {
    id: string;
    lang: Locale;
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
  if (!hasCourseEditRights(user)) {
    redirect('/');
  }

  return (
    <CourseForm
      lang={params.lang}
      tags={tags}
      courseData={course}
      templates={[]}
    />
  );
}
