'use client';

import React from 'react';
import { Button, Grow, Tooltip, TooltipProps } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { alpha } from '@mui/system';
import { useTheme } from '@mui/material/styles';

interface StyledTooltipProps {
  title: string;
  arrow?: boolean;
  placement?: TooltipProps['placement'];
}

export default function StyledTooltip({
  title,
  arrow = true,
  placement = 'bottom-start',
}: StyledTooltipProps): JSX.Element {
  const theme = useTheme();
  const [show, setShow] = React.useState(false);

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
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => setShow(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      }
      arrow={arrow}
      placement={placement}
      TransitionComponent={Grow}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: alpha(theme.palette.coverBlue.light, 0.92),
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)',
            '& .MuiTooltip-arrow': {
              color: alpha(theme.palette.coverBlue.light, 0.92),
            },
          },
        },
      }}
      open={show}
      onOpen={() => setShow(true)}
      onClose={() => setShow(false)}
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
