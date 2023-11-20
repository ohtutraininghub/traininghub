import { prisma } from '@/lib/prisma';
import ProfileView from '@/components/ProfileView';
import Container from '@mui/material/Container/Container';
import CourseModal from '@/components/CourseModal/CourseModal';
import { getServerAuthSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { Locale } from '@i18n/i18n-config';
import { useTranslation } from '@/lib/i18n';
import { getAllUsers } from '@/lib/prisma/users';
import CreateTag from '../admin/dashboard/CreateTag';
import { getTags } from '@/lib/prisma/tags';

type Props = {
  searchParams: { courseId?: string };
  params: { lang: Locale };
};

export default async function ProfilePage({ searchParams, params }: Props) {
  const session = await getServerAuthSession();
  const { t } = await useTranslation(params.lang, ['components', 'admin']);
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

  return (
    <Container maxWidth="md">
      <CourseModal
        lang={params.lang}
        course={openedCourse}
        usersEnrolledCourseIds={courseIds}
        enrolls={t('CourseModal.enrolls', {
          studentCount: openedCourse?._count.students,
          maxStudentCount: openedCourse?.maxStudents,
        })}
        description={t('CourseModal.description')}
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
          existingTagLabel={t('admin:CreateTag.tagsLabel')}
          tags={tags}
          lang={params.lang}
        />
      </ProfileView>
    </Container>
  );
}
