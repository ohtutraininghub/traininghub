'use client';

import Button from '@mui/material/Button';
import { useState } from 'react';
import { ConfirmCard } from '../ConfirmCard';
import { signOut } from 'next-auth/react';
import { useDictionary } from '@/lib/i18n/hooks';
import { Locale } from '@/lib/i18n/i18n-config';

interface Props {
  lang: Locale;
}

export function SignOutButton({ lang }: Props) {
  const [backdropOpen, setBackdropOpen] = useState(false);
  const dict = useDictionary(lang);

  return (
    <>
      <Button
        variant="text"
        sx={{ color: 'black.main', padding: '0.75em' }}
        onClick={() => {
          setBackdropOpen(true);
        }}
      >
        {dict.Navbar.signOutButton.signOut}
      </Button>
      <ConfirmCard
        lang={lang}
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={dict.Navbar.signOutButton.signOutConfirmation}
        handleClick={() => signOut()}
      />
    </>
  );
}
