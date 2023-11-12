'use client';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, IconButton, Tooltip } from '@mui/material';

interface Props {
  confirmTooltip: string;
  cancelTooltip: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export function SmallConfirmCard({
  confirmTooltip,
  cancelTooltip,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <Box display="flex">
      <Tooltip title={cancelTooltip}>
        <IconButton onClick={() => onCancel()}>
          <ClearIcon aria-label="cancel" color="warning" />
        </IconButton>
      </Tooltip>
      <Tooltip title={confirmTooltip}>
        <IconButton onClick={() => onSubmit()}>
          <CheckIcon arial-label="confirm" color="success" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
