'use client';

import * as React from 'react';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import WindowIcon from '@mui/icons-material/Window';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function CourseViewToggle() {
  const { palette } = useTheme();
  const [viewStyle, setViewStyle] = React.useState<string | null>('grid');
  const handleViewToggle = (
    // eslint-disable-next-line
    event: React.MouseEvent<HTMLElement>,
    newViewStyle: string | null
  ) => {
    if (newViewStyle !== null) {
      setViewStyle(newViewStyle);
    }
  };

  return (
    <div>
      <ToggleButtonGroup
        value={viewStyle}
        exclusive
        onChange={handleViewToggle}
        aria-label="course view style"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <ToggleButton value="grid" aria-label="grid view">
          <WindowIcon />
        </ToggleButton>
        <ToggleButton value="list" aria-label="list view">
          <ViewHeadlineIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant="caption"
          style={{
            fontWeight: 500,
            textTransform: 'uppercase',
            color: palette.white.main,
            marginRight: '20px',
          }}
        >
          Grid
        </Typography>
        <Typography
          variant="caption"
          style={{
            fontWeight: 500,
            color: palette.white.main,
            textTransform: 'uppercase',
          }}
        >
          List
        </Typography>
      </div>
    </div>
  );
}
