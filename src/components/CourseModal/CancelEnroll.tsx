'use client';

import Button from '@mui/material/Button';
import { ConfirmCard } from '../ConfirmCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessage } from '../Providers/MessageProvider';
import { update } from '@/lib/response/fetchUtil';

type Props = {
  courseId: string;
};

export default function CancelEnroll({ courseId }: Props) {
  const router = useRouter();
  const [backdropOpen, setBackdropOpen] = useState(false);
  const { notify } = useMessage();

  const handleCancelEnroll = async () => {
    const responseJson = await update('/api/course/enroll', courseId);
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
        Cancel enrollment
      </Button>
      <ConfirmCard
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={'Are you sure you want to unenroll from the course?'}
        handleClick={handleCancelEnroll}
      />
    </>
  );
}
