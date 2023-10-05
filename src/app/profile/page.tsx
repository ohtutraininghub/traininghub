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

  console.log(userData);

  return (
    <Box>
      {userData?.name} <br />
      {userData?.email} <br />
      {userData?.image} <br />
    </Box>
  );
}
