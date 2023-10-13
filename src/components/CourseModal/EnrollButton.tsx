'use client';

import Button from '@mui/material/Button';
import { ConfirmCard } from '@/components/ConfirmCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessage } from '../Providers/MessageProvider';
import { post } from '@/lib/response/fetchUtil';

type Props = {
  courseId: string;
};

export default function EnrollButton({ courseId }: Props) {
  const [backdropOpen, setBackdropOpen] = useState(false);
  const router = useRouter();
  const { notify } = useMessage();

  const handleEnroll = async () => {
    const responseJson = await post('/api/course/enroll', courseId);
    notify(responseJson);
    router.refresh();
  };

  return (
    <>
      <Button
        onClick={() => {
          setBackdropOpen(true);
        }}
      >
        Enroll
      </Button>
      <ConfirmCard
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={'Confirm enroll?'}
        handleClick={() => handleEnroll()}
      />
    </>
  );
}
