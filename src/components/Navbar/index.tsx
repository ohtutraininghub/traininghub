import { AppBar } from '@mui/material';
import Link from 'next/link';
import { getServerAuthSession } from '@/lib/auth';
import ProfileMenu from '@/components/ProfileMenu';

export default async function NavBar() {
  const session = await getServerAuthSession();

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
        Training hub
      </Link>
      <ProfileMenu name={session.user.name} image={session.user.image} />
    </AppBar>
  );
}
