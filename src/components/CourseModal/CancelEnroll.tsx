'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TimerOutlined from '@mui/icons-material/TimerOutlined';
import Typography from '@mui/material/Typography';
import { ConfirmCard } from '../ConfirmCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessage } from '../Providers/MessageProvider';
import { update } from '@/lib/response/fetchUtil';
import { msUntilStart } from '@/lib/timedateutils';
import { minCancelTimeMs } from '@/lib/zod/courses';

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
    return msUntilStart(startDate) > minCancelTimeMs;
  };

  if (!cancellingAllowed(startDate)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'row',
          border: 1,
          borderRadius: '8px',
          mt: '1em',
          p: '1em 1em 1em 0.5em',
        }}
      >
        <TimerOutlined sx={{ flex: 1 }} />
        <Typography variant="body2" sx={{ flex: 6 }}>
          The course starts soon. Contact the trainer if you want to cancel you
          enrollment.
        </Typography>
      </Box>
    );
  }

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
