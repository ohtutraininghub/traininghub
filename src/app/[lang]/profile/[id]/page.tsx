import Container from '@mui/material/Container/Container';
import { getUserData } from '@/lib/prisma/users';
import { Locale } from '@/lib/i18n/i18n-config';
import { notFound } from 'next/navigation';
import { isAdmin } from '@/lib/auth-utils';
import UnauthorizedError from '@/components/UnauthorizedError';
import { getServerAuthSession } from '@/lib/auth';

import ProfileUserDetails from '@/components/ProfileView/ProfileUserDetails';

type Props = {
  params: {
    id: string;
    lang: Locale;
  };
};

export default async function ProfilePageById({ params }: Props) {
  const session = await getServerAuthSession();
  const userId = params.id;
  const userData = await getUserData(userId);

  if (!userData) {
    notFound();
  }
  if (!isAdmin(session.user)) {
    return <UnauthorizedError lang={params.lang} />;
  }

  return (
    <Container maxWidth="md">
      <div style={{ paddingBottom: '20px', paddingTop: '32px' }}>
        <ProfileUserDetails
          name={userData?.name ?? ''}
          email={userData?.email ?? ''}
          image={userData?.image ?? ''}
          country={userData?.country?.name ?? ''}
          title={userData?.title?.name ?? ''}
        />
      </div>
    </Container>
  );
}
