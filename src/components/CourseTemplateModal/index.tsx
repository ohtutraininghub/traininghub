'use client';

import React from 'react';
import Modal from '@mui/material/Modal';
import { Box, IconButton, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { DictProps } from '@/lib/i18n';
import { EditTemplateForm } from './EditTemplateForm';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

interface CourseTemplateModalProps extends DictProps {
  templateId: string;
  open: boolean;
  onClose: () => void;
}

export default function CourseTemplateModal({
  lang,
  templateId,
  onClose,
}: CourseTemplateModalProps) {
  const { palette } = useTheme();
  const handleClick = (event: object, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      onClose();
    }
  };
  const submitTemplate = () => {
    onClose();
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
          zIndex: 1200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            backgroundColor: palette.surface.main,
            boxShadow: 8,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: '1000px',
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'auto',
            overflowWrap: 'break-word',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              padding: 1,
            }}
          >
            <IconButton onClick={onClose}>
              <CloseIcon sx={{ fontSize: '25px' }} />
            </IconButton>
          </Box>
          <Typography
            variant="h2"
            color={palette.black.main}
            textAlign="center"
            marginBottom={1}
          >
            Edit Template Details
          </Typography>
          <EditTemplateForm
            templateId={templateId}
            lang={lang}
            submitTemplate={submitTemplate}
          />
        </Card>
      </Modal>
    </div>
  );
}
