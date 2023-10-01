import { AppBar, Typography } from '@mui/material';
import Link from 'next/link';
import { SignOutButton } from '@/components/Buttons/Buttons';
import { getServerAuthSession } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { DictProps } from '@i18n/i18n';

export default async function NavBar({ lang }: DictProps) {
  const session = await getServerAuthSession();
  const dict = await getDictionary(lang);

  return (
    <AppBar
      sx={{
        position: 'static',
        top: 0,
        left: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: '0 0.5em', sm: '0 1em' },
        marginBottom: '2em',
        textAlign: 'center',
      }}
    >
      <Link
        href="/"
        style={{ fontWeight: 700, textDecoration: 'none', color: 'black' }}
      >
        {dict.AppTitle}
      </Link>
      <Typography variant="body2">
        {dict.Navbar.loggedUser.replace('{x}', session?.user?.name ?? '')}
      </Typography>
      <SignOutButton lang={lang} />
    </AppBar>
  );
}
