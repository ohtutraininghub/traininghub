'use client';

import React from 'react';
import { Button, Grow, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { alpha } from '@mui/system';
import { useTheme } from '@mui/material/styles';

interface StyledTooltipProps {
  title: string;
}

export default function StyledTooltip({
  title,
}: StyledTooltipProps): JSX.Element {
  const theme = useTheme();

  return (
    <Tooltip
      title={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <span>{title}</span>
          <div
            style={{ display: 'flex', marginTop: '8px', marginLeft: 'auto' }}
          >
            <Button variant="text" color="primary" size="small">
              Got it
            </Button>
          </div>
        </div>
      }
      arrow
      placement="bottom-start"
      TransitionComponent={Grow}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: alpha(theme.palette.coverBlue.light, 0.92),
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            '& .MuiTooltip-arrow': {
              color: alpha(theme.palette.coverBlue.light, 0.92),
            },
          },
        },
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: '100%',
          verticalAlign: 'middle',
        }}
      >
        <InfoOutlinedIcon fontSize="small" style={{ marginLeft: 5 }} />
      </div>
    </Tooltip>
  );
}
