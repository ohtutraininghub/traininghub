import { AppBar, Typography } from '@mui/material';
import Link from 'next/link';
import { SignOutButton } from '@/components/Buttons/Buttons';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function NavBar() {
  const session = await getServerSession(authOptions);

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
        Training hub
      </Link>
      <Typography variant="body2">
        Logged in as {session?.user?.name}
      </Typography>
      <Link href="/profile" style={{}}>
        Temp profile link
      </Link>
      <SignOutButton />
    </AppBar>
  );
}
