'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import StyleIcon from '@mui/icons-material/Style';
import SchoolIcon from '@mui/icons-material/School';
import { useRouter } from 'next/navigation';

export interface speedDialAction {
  icon: React.JSX.Element;
  name: string;
  link: string;
  testid: string;
}

export const speedDialActions: speedDialAction[] = [
  {
    icon: <StyleIcon />,
    name: 'Add tag',
    link: 'admin/create-tag',
    testid: 'add-tag',
  },
  {
    icon: <SchoolIcon />,
    name: 'New course',
    link: 'course/create',
    testid: 'new-course',
  },
];

export default function SpeedDialMenu() {
  const router = useRouter();

  const handleActionClick = (link: string) => {
    router.push(link);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 30,
        right: 30,
        zIndex: 1000,
      }}
    >
      <SpeedDial ariaLabel="SpeedDial menu" icon={<SpeedDialIcon />}>
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            data-testid={action.testid}
            onClick={() => handleActionClick(action.link)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
