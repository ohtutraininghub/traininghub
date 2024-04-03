import Container from '@mui/material/Container/Container';
import { getUserData } from '@/lib/prisma/users';
import { Locale } from '@/lib/i18n/i18n-config';

import ProfileUserDetails from '@/components/ProfileView/ProfileUserDetails';

type Props = {
  params: {
    id: string;
    lang: Locale;
  };
};

export default async function ProfilePageById({ params }: Props) {
  const userId = params.id;
  const userData = await getUserData(userId);

  return (
    <Container>
      <div style={{ paddingTop: '32px', width: '100%' }}>
        <ProfileUserDetails
          name={userData?.name ?? ''}
          email={userData?.email ?? ''}
          image={userData?.image ?? ''}
        />
      </div>
    </Container>
  );
}
