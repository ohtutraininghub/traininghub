import NewCourseButton from '@/components/Buttons/NewCourseButton';
import NewTagButton from '@/components/Buttons/NewTagButton';
import { notFound } from 'next/navigation';
import { getCourses, getEnrolledCourseIdsByUserId } from '@/lib/prisma/courses';
import { getServerAuthSession } from '@/lib/auth';
import CourseFilter from '@/components/CourseFilter/CourseFilter';
import { prisma } from '@/lib/prisma/index';
import CourseList from '@/components/CourseList/CourseList';
import { Locale } from '@/lib/i18n/i18n-config';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: {
    courseName?: string;
    courseTag?: string;
    courseDates?: string;
    courseId?: string;
  };
  params: {
    lang: Locale;
  };
};

export default async function HomePage({ searchParams, params }: Props) {
  const session = await getServerAuthSession();
  const courses = await getCourses();

  const courseId = searchParams.courseId;
  const openedCourse = courses.find((course) => course.id === courseId);
  if (courseId && !openedCourse) {
    notFound();
  }

  const usersEnrolledCourseIds = await getEnrolledCourseIdsByUserId(
    session.user.id
  );

  const tags = await prisma.tag.findMany({});

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
      <NewCourseButton lang={params.lang} />
      <NewTagButton lang={params.lang} />
      <CourseFilter initialCourses={courses} initialTags={tags} />
      <CourseList
        lang={params.lang}
        courses={courses}
        openedCourse={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
        searchCourses={{
          courseName: searchParams.courseName,
          courseTag: searchParams.courseTag,
          courseDates: searchParams.courseDates,
        }}
      />
    </div>
  );
}
