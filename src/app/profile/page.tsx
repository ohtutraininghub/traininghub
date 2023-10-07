import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

  return (
    <div>
      <ProfileView
        userDetails={{
          name: userData?.name ?? '',
          email: userData?.email ?? '',
          image: userData?.image ?? '',
        }}
        courses={temporaryCourses}
      />
    </div>
  );
}
