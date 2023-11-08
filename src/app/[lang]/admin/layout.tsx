import UnauthorizedError from '@/components/UnauthorizedError';
import { getServerAuthSession } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { DictProps } from '@/lib/i18n';
import Container from '@mui/material/Container';

interface Props extends DictProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children, lang }: Props) {
  const session = await getServerAuthSession();
  if (!isAdmin(session.user)) {
    return <UnauthorizedError lang={lang} />;
  }

  return (
    <Container maxWidth="md" style={{ paddingTop: '32px' }}>
      {children}
    </Container>
  );
}
