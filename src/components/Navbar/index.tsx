import { AppBar, Box } from '@mui/material';
import Link from 'next/link';
import { getServerAuthSession } from '@/lib/auth';
import ProfileMenu from '@/components/ProfileMenu';
import Image from 'next/image';
import { DictProps } from '@/lib/i18n';

interface Props extends DictProps {}

export default async function NavBar({ lang }: Props) {
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
        textAlign: 'center',
      }}
    >
      <Link href="/">
        <Box
          sx={{
            paddingTop: '5px',
            paddingLeft: '10px',
            display: 'inline-block',
          }}
        >
          <Image
            src="/decorated_small_logo.png"
            alt="TrainingHub logo"
            width={107}
            height={55}
            priority={true}
          />
        </Box>
      </Link>
      <ProfileMenu
        lang={lang}
        name={session.user.name}
        image={session.user.image}
      />
    </AppBar>
  );
}
