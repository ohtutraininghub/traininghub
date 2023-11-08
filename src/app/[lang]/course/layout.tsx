import UnauthorizedError from '@/components/UnauthorizedError';
import { getServerAuthSession } from '@/lib/auth';
import { isTrainerOrAdmin } from '@/lib/auth-utils';
import type { Locale } from '@/lib/i18n/i18n-config';

interface Props {
  children: React.ReactNode;
  lang: Locale;
}

export default async function CourseLayout({ children, lang }: Props) {
  const session = await getServerAuthSession();
  if (!isTrainerOrAdmin(session.user)) {
    return <UnauthorizedError lang={lang} />;
  }

  return <>{children}</>;
}
