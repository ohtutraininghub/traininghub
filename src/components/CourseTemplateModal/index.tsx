'use client';

import React from 'react';
import Modal from '@mui/material/Modal';
import { Typography } from '@mui/material';
import Card from '@mui/material/Card';

interface CourseTemplateModalProps {
  templateId: string;
  open: boolean;
  onClose: () => void;
}

export default function CourseTemplateModal({
  templateId,
  onClose,
}: CourseTemplateModalProps) {
  const handleClick = (event: object, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      onClose();
    }
  };

  return (
    <div data-testid="template-modal">
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
        <Card
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: '1000px',
            height: '900px',
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'auto',
            overflowWrap: 'break-word',
            borderRadius: '10px',
            m: 2,
            p: 3,
            color: 'white.main',
            backgroundColor: 'secondary.main',
            textAlign: 'center',
            outline: 0,
          }}
        >
          {/* The following is just test text */}
          <Typography variant="h1" sx={{ textAlign: 'center' }}>
            Template ID: {templateId}
          </Typography>
        </Card>
      </Modal>
    </div>
  );
}
