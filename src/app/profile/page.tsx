import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/prisma';
import ProfileView from '@/components/ProfileView';
import Container from '@mui/material/Container/Container';
import CourseModal from '@/components/CourseModal/CourseModal';

type Props = {
  searchParams: { courseId?: string };
};

export default async function ProfilePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  const userData = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
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

  const courseIds = userData?.courses.map((course) => course.id) ?? [];
  const openedCourse = userData?.courses.find(
    (course) => course.id === searchParams.courseId
  );

  return (
    <Container maxWidth="md">
      <CourseModal course={openedCourse} usersEnrolledCourseIds={courseIds} />
      <ProfileView
        userDetails={{
          name: userData?.name ?? '',
          email: userData?.email ?? '',
          image: userData?.image ?? '',
        }}
        courses={userData?.courses ?? []}
      />
    </Container>
  );
}
