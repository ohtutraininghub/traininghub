import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Box from '@mui/material/Box/Box';

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
  const temporaryCourses = await prisma.course.findMany({
    orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
  });

  console.log(userData);

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
      {userData?.name} <br />
      {userData?.email} <br />
      {userData?.image} <br />
      <h5>Past courses</h5>
      <ul>
        {endedCourses.map((course) => (
          <li key={course.id}>
            {course.name} - {course.startDate.toDateString()} -{' '}
            {course.endDate.toDateString()}
          </li>
        ))}
      </ul>
      <h5>In progress courses</h5>
      <ul>
        {inProgressCourses.map((course) => (
          <li key={course.id}>
            {course.name} - {course.startDate.toDateString()} -{' '}
            {course.endDate.toDateString()}
          </li>
        ))}
      </ul>
      <h5>Ended courses</h5>
      <ul>
        {upcomingCourses.map((course) => (
          <li key={course.id}>
            {course.name} - {course.startDate.toDateString()} -{' '}
            {course.endDate.toDateString()}
          </li>
        ))}
      </ul>
    </Box>
  );
}
