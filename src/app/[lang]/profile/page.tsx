import { prisma } from '@/lib/prisma';
import ProfileView from '@/components/ProfileView';
import Container from '@mui/material/Container/Container';
import CourseModal from '@/components/CourseModal/CourseModal';
import { getServerAuthSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Locale } from '@i18n/i18n-config';
import { translator } from '@/lib/i18n';
import {
  UserNamesAndIds,
  getAllUsers,
  getStudentNamesByCourseId,
} from '@/lib/prisma/users';
import CreateTag from '../admin/dashboard/CreateTag';
import { getTags } from '@/lib/prisma/tags';
import { isTrainerOrAdmin } from '@/lib/auth-utils';

type Props = {
  searchParams: { courseId?: string };
  params: { lang: Locale };
};

export default async function ProfilePage({ searchParams, params }: Props) {
  const session = await getServerAuthSession();
  const { t } = await translator(['components', 'admin']);
  const allUsers = await getAllUsers();
  const userData = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      courses: {
        include: {
          tags: true,
          _count: {
            select: {
              students: true,
            },
          },
        },
        orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
      },
    },
  });
  const tags = await getTags();

  if (!userData) {
    notFound();
  }

  const courseIds = userData?.courses.map((course) => course.id) ?? [];
  const openedCourse = userData?.courses.find(
    (course) => course.id === searchParams.courseId
  );

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
        userDetails={{
          name: userData.name ?? '',
          email: userData.email ?? '',
          image: userData.image ?? '',
        }}
        courses={userData?.courses ?? []}
        users={allUsers}
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
