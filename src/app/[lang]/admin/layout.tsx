import UnauthorizedError from '@/components/UnauthorizedError';
import { getServerAuthSession } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import Container from '@mui/material/Container';
import type { Locale } from '@/lib/i18n/i18n-config';

interface Props {
  children: React.ReactNode;
  params: { lang: Locale };
}

export default async function AdminLayout({ children, params }: Props) {
  const session = await getServerAuthSession();
  if (!isAdmin(session.user)) {
    return <UnauthorizedError lang={params.lang} />;
  }

  return (
    <Container maxWidth="md" style={{ paddingTop: '32px' }}>
      {children}
    </Container>
  );
}
