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
  getTemplatesWithCreator,
  getTemplatesByUserIdWithCreator,
} from '@/lib/prisma/templates';
import CreateTag from '../admin/dashboard/CreateTag';
import { getTags } from '@/lib/prisma/tags';
import { isAdmin, isTrainerOrAdmin } from '@/lib/auth-utils';

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

  if (!userData) {
    notFound();
  }
  const allCourses = userData?.createdCourses.concat(userData?.courses) ?? [];
  const courseIds = allCourses.map((course) => course.id);
  const openedCourse = allCourses.find(
    (course) => course.id === searchParams.courseId
  );

  const templates = isAdmin(session.user)
    ? await getTemplatesWithCreator()
    : await getTemplatesByUserIdWithCreator(session.user.id);

  let enrolledStudents: UserNamesAndIds | null = null;
  if (isTrainerOrAdmin(session.user) && openedCourse) {
    enrolledStudents = await getStudentNamesByCourseId(openedCourse.id);
  }

  return (
    <Container maxWidth="md">
      <CourseModal
        lang={params.lang}
        course={openedCourse}
        usersEnrolledCourseIds={courseIds}
        enrolledStudents={enrolledStudents}
        enrolls={t('CourseModal.enrolls', {
          studentCount: openedCourse?._count.students,
          maxStudentCount: openedCourse?.maxStudents,
        })}
        editCourseLabel={t('EditButton.editCourse')}
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
        tags={tags}
      >
        <CreateTag
          tagsHeader={t('admin:TagsSection.header')}
          tags={tags}
          lang={params.lang}
        />
      </ProfileView>
    </Container>
  );
}
