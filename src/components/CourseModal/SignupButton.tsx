'use client';

import Button from '@mui/material/Button';
import { ConfirmCard } from '@/components/ConfirmCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  courseId: string;
};

export default function SignupButton({ courseId }: Props) {
  const [backdropOpen, setBackdropOpen] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await fetch('/api/course/signup', {
        method: 'POST',
        body: JSON.stringify(courseId),
      });

      if (!response.ok) {
        throw response;
      }
      alert('Successfully signed up!');
      router.refresh();
    } catch (error: any) {
      alert(error?.statusText ?? 'Internal server error');
      console.error(error);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          setBackdropOpen(true);
        }}
      >
        Signup
      </Button>
      <ConfirmCard
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={'Confirm signup?'}
        handleClick={() => handleSignup()}
      />
    </>
  );
}
