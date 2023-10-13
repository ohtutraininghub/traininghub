'use client';

import Button from '@mui/material/Button';
import { useState } from 'react';
import { ConfirmCard } from '../ConfirmCard';
import { signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

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
        handleClick={() => signOut()}
      />
    </>
  );
}

export function CourseModalCloseButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('courseId');
    router.replace('/?' + params);
  };

  return (
    <Button sx={{ display: 'block', ml: 'auto' }} onClick={handleClick}>
      Close
    </Button>
  );
}
