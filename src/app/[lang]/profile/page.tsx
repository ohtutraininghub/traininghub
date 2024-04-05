import ProfileView from '@/components/ProfileView';
import Container from '@mui/material/Container/Container';
import CourseModal from '@/components/CourseModal';
import { getServerAuthSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Locale } from '@i18n/i18n-config';
import { translator } from '@/lib/i18n';
import {
  UserNamesAndIds,
  getAllUsers,
  getStudentNamesByCourseId,
  getUserData,
} from '@/lib/prisma/users';
import {
  RequestsAndUserNames,
  getRequestsByCourseId,
} from '@/lib/prisma/requests';
import {
  getTemplatesWithCreator,
  getTemplatesByUserIdWithCreator,
} from '@/lib/prisma/templates';
import CreateTag from '../admin/dashboard/CreateTag';
import CreateCountry from '../admin/dashboard/CreateCountry';
import { getTags } from '@/lib/prisma/tags';
import { getCountries } from '@/lib/prisma/country';
import { isAdmin, isTrainerOrAdmin } from '@/lib/auth-utils';
import { getTitles } from '@/lib/prisma/title';

type Props = {
  searchParams: { courseId?: string };
  params: { lang: Locale };
};

export default async function ProfilePage({ searchParams, params }: Props) {
  const session = await getServerAuthSession();
  const { t } = await translator(['components', 'admin']);
  const allUsers = await getAllUsers();
  const userData = await getUserData(session.user.id);
  const tags = await getTags();
  const countries = await getCountries();
  const titles = await getTitles();

  if (!userData) {
    notFound();
  }
  const allCourses = userData?.createdCourses.concat(userData?.courses) ?? [];
  const enrolledCourseIds = userData.courses.map((course) => course.id) ?? [];
  const openedCourse = allCourses.find(
    (course) => course.id === searchParams.courseId
  );

  const templates = isAdmin(session.user)
    ? await getTemplatesWithCreator()
    : await getTemplatesByUserIdWithCreator(session.user.id);

  let enrolledStudents: UserNamesAndIds | null = [];
  if (isTrainerOrAdmin(session.user) && openedCourse) {
    enrolledStudents = await getStudentNamesByCourseId(openedCourse.id);
  }

  let requests: RequestsAndUserNames | null = [];
  if (isTrainerOrAdmin(session.user) && openedCourse) {
    requests = await getRequestsByCourseId(openedCourse.id);
  }

  return (
    <Container maxWidth="md">
      <CourseModal
        lang={params.lang}
        course={openedCourse}
        usersEnrolledCourseIds={enrolledCourseIds}
        enrolledStudents={enrolledStudents}
        requests={requests}
      />
      <ProfileView
        lang={params.lang}
        userDetails={{
          name: userData.name ?? '',
          email: userData.email ?? '',
          image: userData.image ?? '',
        }}
        courses={userData?.courses ?? []}
        createdCourses={userData?.createdCourses ?? []}
        users={allUsers}
        templates={templates}
        countries={countries}
        titles={titles}
        tags={tags}
      >
        <CreateCountry
          countryHeader={t('admin:CountriesSection.header')}
          countries={countries}
          lang={params.lang}
        />
        <CreateTag
          tagsHeader={t('admin:TagsSection.header')}
          tags={tags}
          lang={params.lang}
        />
      </ProfileView>
    </Container>
  );
}
