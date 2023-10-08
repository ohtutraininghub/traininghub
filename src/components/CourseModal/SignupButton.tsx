'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ConfirmCard } from '@/components/ConfirmCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  courseId: string;
  currentStudents: number;
  maxStudents: number;
};

export default function SignupButton({
  courseId,
  currentStudents,
  maxStudents,
}: Props) {
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
    <Box sx={{ mt: 'auto', pt: 3 }}>
      <Typography>
        Signups: {currentStudents} / {maxStudents}
      </Typography>
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
    </Box>
  );
}
