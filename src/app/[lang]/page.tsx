import CourseList from '@/components/CourseList';
import { notFound } from 'next/navigation';
import { getAllCourses } from '@/lib/prisma/courses';
import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma/index';
import { Locale } from '@/lib/i18n/i18n-config';
import BackgroundContainer from '@/components/BackgroundContainer';
import SpeedDialMenu from '@/components/SpeedDialMenu';
import SearchMenu from '@/components/SearchMenu';
import { isTrainerOrAdmin } from '@/lib/auth-utils';
import {
  UserNamesAndIds,
  getStudentNamesByCourseId,
  getUsersEnrolls,
  getUsersRequests,
} from '@/lib/prisma/users';
import BackToTopToggle from '@/components/BackToTopToggle';
import {
  RequestsAndUserNames,
  getRequestsByCourseId,
} from '@/lib/prisma/requests';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: {
    courseName?: string;
    courseTag?: string;
    startDate?: string;
    endDate?: string;
    courseId?: string;
  };
  params: {
    lang: Locale;
  };
};

export default async function HomePage({ searchParams, params }: Props) {
  const session = await getServerAuthSession();
  const courses = await getAllCourses();
  const courseId = searchParams.courseId;
  const openedCourse = courses.find((course) => course.id === courseId);

  if (courseId && !openedCourse) {
    notFound();
  }

  let enrolledStudents: UserNamesAndIds | null = [];
  if (isTrainerOrAdmin(session.user) && openedCourse) {
    enrolledStudents = await getStudentNamesByCourseId(openedCourse.id);
  }

  let requests: RequestsAndUserNames | null = [];
  if (isTrainerOrAdmin(session.user) && openedCourse) {
    requests = await getRequestsByCourseId(openedCourse.id);
  }

  const usersEnrolls = await getUsersEnrolls(session.user.id);

  const usersEnrolledCourseIds = usersEnrolls?.courses.map(
    (course) => course.id
  );

  const usersRequests = await getUsersRequests(session.user.id);

  const usersRequestedCourseIds = usersRequests.map(
    (request) => request.courseId
  );

  const tags = await prisma.tag.findMany({});

  return (
    <BackgroundContainer>
      <SearchMenu
        initialCourses={courses}
        initialTags={tags}
        lang={params.lang}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'start',
          flexDirection: 'column',
          color: 'white',
        }}
      >
        <h4>JSON.stringify(searchParams): {JSON.stringify(searchParams)}</h4>
        <h4>courseId: {courseId}</h4>
        <h4>openedCourse: {JSON.stringify(openedCourse)}</h4>
        <h4>all course Ids: {courses.map((c) => c.id)}</h4>
      </div>
      {isTrainerOrAdmin(session.user) && <SpeedDialMenu />}
      <CourseList
        lang={params.lang}
        courses={courses}
        openedCourse={openedCourse}
        usersEnrolledCourseIds={usersEnrolledCourseIds}
        usersRequestedCourseIds={usersRequestedCourseIds}
        enrolledStudents={enrolledStudents}
        requests={requests}
        searchCourses={{
          courseName: searchParams.courseName,
          courseTag: searchParams.courseTag,
          startDate: searchParams.startDate,
          endDate: searchParams.endDate,
        }}
      />
      <BackToTopToggle />
    </BackgroundContainer>
  );
}
