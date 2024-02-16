'use client';

import React from 'react';
import Modal from '@mui/material/Modal';
import { Box, IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import { DictProps } from '@/lib/i18n';
import { EditTemplateForm } from './EditTemplateForm';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Tag } from '@prisma/client';
import { TemplateWithTags } from '@/lib/prisma/templates';

interface CourseTemplateModalProps extends DictProps {
  template: TemplateWithTags;
  open: boolean;
  onClose: () => void;
  tags: Tag[];
}

export default function CourseTemplateModal({
  lang,
  template,
  onClose,
  tags,
}: CourseTemplateModalProps) {
  const { palette } = useTheme();
  const handleClick = (event: object, reason: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      onClose();
    }
  };
  const updateTemplate = () => {
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
              backgroundColor: 'modal.main',
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
            <IconButton onClick={onClose} data-testid={'closeButton'}>
              <CloseIcon sx={{ fontSize: '25px' }} />
            </IconButton>
          </Box>
          <EditTemplateForm
            tags={tags}
            templateData={template}
            lang={lang}
            updateTemplate={updateTemplate}
          />
        </Card>
      </Modal>
    </div>
  );
}
