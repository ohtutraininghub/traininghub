'use client';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmCard } from '../ConfirmCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessage } from '../Providers/MessageProvider';
import { update } from '@/lib/response/fetchUtil';
import { Box, Typography } from '@mui/material';
import { msUntilStart } from '@/lib/timedateutils';
import { minCancelTimelMs } from '@/lib/zod/courses';

type Props = {
  courseId: string;
  startDate: Date;
};

export default function CancelEnroll({ courseId, startDate }: Props) {
  const router = useRouter();
  const [backdropOpen, setBackdropOpen] = useState(false);
  const { notify } = useMessage();

  const handleCancelEnroll = async () => {
    const responseJson = await update('/api/course/enroll', courseId);
    notify(responseJson);
    router.refresh();
  };

  const cancellingAllowed = (startDate: Date): boolean => {
    return msUntilStart(startDate) > minCancelTimelMs;
  };

  if (!cancellingAllowed(startDate)) {
    return (
      <Box my={1} p={1} sx={{ border: '1px solid', borderRadius: '4px' }}>
        <Typography>
          The course is starting soon.
          <br />
          Contact the trainer if you want to cancel your enrollment.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Button
        startIcon={<DeleteIcon />}
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
