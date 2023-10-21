import NewCourseButton from '@/components/Buttons/NewCourseButton';
import NewTagButton from '@/components/Buttons/NewTagButton';
import { notFound } from 'next/navigation';
import { getCourses, getEnrolledCourseIdsByUserId } from '@/lib/prisma/courses';
import { getServerAuthSession } from '@/lib/auth';
import CourseFilter from '@/components/CourseFilter/CourseFilter';
import { prisma } from '@/lib/prisma/prisma';
import CourseList from '@/components/CourseList/CourseList';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: {
    courseName?: string;
    courseTag?: string;
    courseDates?: string;
    courseId?: string;
  };
};

export default async function HomePage({ searchParams }: Props) {
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
      <NewCourseButton />
      <NewTagButton />
      <CourseFilter initialCourses={courses} initialTags={tags} />
      <CourseList
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
