import UnauthorizedError from '@/components/UnauthorizedError';
import { getServerAuthSession } from '@/lib/auth';
import { isTrainerOrAdmin } from '@/lib/auth-utils';
import { DictProps } from '@/lib/i18n';

interface Props extends DictProps {
  children: React.ReactNode;
}

export default async function CourseLayout({ children, lang }: Props) {
  const session = await getServerAuthSession();
  if (!isTrainerOrAdmin(session.user)) {
    return <UnauthorizedError lang={lang} />;
  }

  return <>{children}</>;
}
