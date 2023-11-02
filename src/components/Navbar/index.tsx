import { AppBar } from '@mui/material';
import Link from 'next/link';
import { getServerAuthSession } from '@/lib/auth';
import ProfileMenu from '@/components/ProfileMenu';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n';

interface Props extends DictProps {}

export default async function NavBar({ lang }: Props) {
  const session = await getServerAuthSession();
  const { t } = await useTranslation(lang, 'app');

  return (
    <AppBar
      sx={{
        position: 'static',
        top: 0,
        left: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: '0 0 0 0.5em', sm: '0 0 0 1em' },
        marginBottom: '2em',
        textAlign: 'center',
      }}
    >
      <Link
        href="/"
        style={{ fontWeight: 700, textDecoration: 'none', color: 'black' }}
      >
        {t('AppTitle')}
      </Link>
      <ProfileMenu
        lang={lang}
        name={session.user.name}
        image={session.user.image}
      />
    </AppBar>
  );
}
