'use client';

import Button from '@mui/material/Button';
import { useState } from 'react';
import { ConfirmCard } from '../ConfirmCard';
//import { signOut } from 'next-auth/react';

export function SignOutButton() {
  const [backdropOpen, setBackdropOpen] = useState(false);
  return (
    <>
      <Button
        variant="text"
        sx={{ color: 'black.main', padding: '0.75em' }}
        onClick={() => {
          setBackdropOpen(true);
        }}
      >
        Sign out
      </Button>
      <ConfirmCard
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={'Confirm sign out?'}
        handleClick={() => {
          throw RangeError('Test front error');
        }} //signOut()}
      />
    </>
  );
}
