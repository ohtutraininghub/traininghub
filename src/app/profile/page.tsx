import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Box from '@mui/material/Box/Box';
import ProfileUserDetails from './ProfileUserDetails';
import ProfileCourseList from './ProfileCourseList';

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
    (course) => course.endDate < currentDate
  );

  const inProgressCourses = temporaryCourses.filter(
    (course) => course.startDate <= currentDate && course.endDate >= currentDate
  );

  const upcomingCourses = temporaryCourses.filter(
    (course) => course.startDate > currentDate
  );

  return (
    <Box>
      <ProfileUserDetails
        name={userData?.name ?? ''}
        email={userData?.email ?? ''}
        image={userData?.image ?? ''}
      />
      <ProfileCourseList headerText="Ended courses" courses={endedCourses} />
      <ProfileCourseList
        headerText="Courses in progress"
        courses={inProgressCourses}
      />
      <ProfileCourseList
        headerText="Upcoming courses"
        courses={upcomingCourses}
      />
    </Box>
  );
}
