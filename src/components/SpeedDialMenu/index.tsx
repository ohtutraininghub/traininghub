'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import StyleIcon from '@mui/icons-material/Style';
import SchoolIcon from '@mui/icons-material/School';
import { useRouter } from 'next/navigation';
import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';

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
  const { data: session, status } = useSession({ required: true });

  if (status === 'loading') return null;

  const handleActionClick = (link: string) => {
    router.push(link);
  };

  const actions =
    session.user.role === Role.ADMIN
      ? speedDialActions
      : speedDialActions.filter((action) => !action.link.startsWith('admin'));

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
        {actions.map((action) => (
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
