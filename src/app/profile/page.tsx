import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma/prisma';
import ProfileView from '@/components/ProfileView';
import Container from '@mui/material/Container/Container';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  const userData = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      courses: {
        orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
      },
    },
  });

  return (
    <Container maxWidth="md">
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
