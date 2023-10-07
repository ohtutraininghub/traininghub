import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Course } from '@prisma/client';
import ProfileView from '@/components/ProfileView';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const usermail = session?.user?.email;
  let userData = null;
  if (usermail) {
    userData = await prisma.user.findUnique({
      where: {
        email: usermail,
      },
      //      include: {
      //        courses: true
      //      },
    });
  }
  if (!userData) return;

  const temporaryCourses = await prisma.course.findMany({
    orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
  });

  const currentDate = new Date();

  const endedCourses = temporaryCourses.filter(
    (course: Course) => course.endDate < currentDate
  );

  const inProgressCourses = temporaryCourses.filter(
    (course: Course) => course.startDate <= currentDate && course.endDate >= currentDate
  );

  const upcomingCourses = temporaryCourses.filter(
    (course: Course) => course.startDate > currentDate
  );

  return (
    <div>
      <ProfileView
          userDetails={{
            name: userData?.name ?? '',
            email: userData?.email ?? '',
            image: userData?.image ?? ''
          }}
          courses={temporaryCourses}
      />
    </div>
  );
}
