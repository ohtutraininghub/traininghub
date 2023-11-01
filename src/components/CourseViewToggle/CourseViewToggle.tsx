'use client';

import * as React from 'react';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import WindowIcon from '@mui/icons-material/Window';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function CourseViewToggle() {
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
    <ToggleButtonGroup
      value={viewStyle}
      exclusive
      onChange={handleViewToggle}
      aria-label="course view style"
    >
      <ToggleButton value="grid" aria-label="grid view">
        <WindowIcon />
      </ToggleButton>
      <ToggleButton value="list" aria-label="list view">
        <ViewHeadlineIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
