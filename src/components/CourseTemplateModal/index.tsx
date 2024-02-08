'use client';

import React from 'react';
import Modal from '@mui/material/Modal';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Typography } from '@mui/material';

interface CourseTemplateModalProps {
  templateId: string;
}

export default function CourseTemplateModal({
  templateId,
}: CourseTemplateModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClick = (event: object, reason: string) => {
    if (reason === 'backdropClick') {
      const params = new URLSearchParams(searchParams);
      params.delete('templateId');
      router.replace(`${pathname}?${params}`);
    }
  };
  return (
    <Modal
      open
      onClose={(event, reason) => handleClick(event, reason)}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        },
      }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* The following is just a placeholder */}
      <Typography variant="h1" sx={{ textAlign: 'center' }}>
        Template ID: {templateId}
      </Typography>
    </Modal>
  );
}
