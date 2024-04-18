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
  Users,
} from '@/lib/prisma/users';
import {
  RequestsAndUserNames,
  getRequestsByCourseId,
} from '@/lib/prisma/requests';
import {
  getTemplatesWithCreator,
  getTemplatesByUserIdWithCreator,
} from '@/lib/prisma/templates';
import CreateTag from '@/app/[lang]/admin/dashboard/CreateTag';
import CreateCountry from '@/app/[lang]/admin/dashboard/CreateCountry';
import CreateTitle from '../../../../components/CreateTitle/CreateTitle';
import UserList from '@/components/UserList';
import { getTags, Tags } from '@/lib/prisma/tags';
import { getCountries, Countries } from '@/lib/prisma/country';
import { isAdmin, isTrainerOrAdmin } from '@/lib/auth-utils';
import UnauthorizedError from '@/components/UnauthorizedError';
import { getTitles, Titles } from '@/lib/prisma/title';
import ExportStats from '@/components/ExportStats';

type Props = {
  searchParams: { courseId?: string };
  params: {
    id: string;
    lang: Locale;
  };
};

export default async function ProfilePageById({ searchParams, params }: Props) {
  const session = await getServerAuthSession();
  const { t } = await translator(['components', 'admin']);
  const ownProfile = params.id === session.user.id;

  if (!isAdmin(session.user) && !ownProfile) {
    return <UnauthorizedError lang={params.lang} />;
  }

  const userData =
    isAdmin(session.user) && !ownProfile
      ? await getUserData(params.id)
      : await getUserData(session.user.id);

  if (!userData) {
    notFound();
  }

  const allCourses = userData?.createdCourses.concat(userData?.courses) ?? [];
  const enrolledCourseIds = userData.courses.map((course) => course.id) ?? [];
  const openedCourse = allCourses.find(
    (course) => course.id === searchParams.courseId
  );

  const templates =
    isAdmin(session.user) && ownProfile
      ? await getTemplatesWithCreator()
      : await getTemplatesByUserIdWithCreator(params.id);

  let enrolledStudents: UserNamesAndIds | null = [];
  let requests: RequestsAndUserNames | null = [];
  if (isTrainerOrAdmin(session.user) && openedCourse) {
    enrolledStudents = await getStudentNamesByCourseId(openedCourse.id);
    requests = await getRequestsByCourseId(openedCourse.id);
  }

  let allUsers: Users | null = [];
  let tags: Tags | null = [];
  let countries: Countries | null = [];
  let titles: Titles | null = [];
  if (isAdmin(session.user)) {
    allUsers = await getAllUsers();
    tags = await getTags();
    countries = await getCountries();
    titles = await getTitles();
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
          country: userData.country?.name ?? '',
          title: userData.title?.name ?? '',
        }}
        courses={userData?.courses ?? []}
        createdCourses={userData?.createdCourses ?? []}
        users={allUsers}
        templates={templates}
        countries={countries}
        tags={tags}
        titles={titles}
      >
        <ExportStats lang={params.lang} />
        <CreateTag
          tagsHeader={t('admin:TagsSection.header')}
          tags={tags}
          lang={params.lang}
        />
        <UserList
          users={allUsers}
          lang={params.lang}
          countries={countries}
          titles={titles}
        />
        <CreateTitle
          titlesHeader={t('admin:TitlesSection.header')}
          titles={titles}
          lang={params.lang}
        />
        <CreateCountry
          countryHeader={t('admin:CountriesSection.header')}
          countries={countries}
          lang={params.lang}
        />
      </ProfileView>
    </Container>
  );
}
