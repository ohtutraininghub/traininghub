'use client';

import Button from '@mui/material/Button';
import { useState } from 'react';
import { ConfirmCard } from '../ConfirmCard';
import { signOut } from 'next-auth/react';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { DictProps } from '@i18n/i18n';

export async function SignOutButton({ lang }: DictProps) {
  const [backdropOpen, setBackdropOpen] = useState(false);
  const dict = await getDictionary(lang);
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
