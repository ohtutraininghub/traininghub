'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useRouter } from 'next/navigation';
import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { assertNever } from '../../../types/validators';

export interface speedDialAction {
  icon: React.JSX.Element;
  name: string;
  link: string;
  testid: string;
  roles: Role[];
}

export const speedDialActions: speedDialAction[] = [
  {
    icon: <AdminPanelSettingsIcon />,
    name: 'Admin dashboard',
    link: 'admin/dashboard',
    testid: 'dashboard',
    roles: ['ADMIN'],
  },
  {
    icon: <SchoolIcon />,
    name: 'New course',
    link: 'course/create',
    testid: 'new-course',
    roles: ['ADMIN', 'TRAINER'],
  },
];

export default function SpeedDialMenu() {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });

  if (status === 'loading') return null;

  const handleActionClick = (link: string) => {
    router.push(link);
  };

  function getActions() {
    if (!session) throw new Error('Invalid session');

    switch (session?.user.role) {
      case 'ADMIN':
        return speedDialActions;
      case 'TRAINER':
        return speedDialActions.filter((action) =>
          action.roles.includes('TRAINER')
        );
      case 'TRAINEE':
        return speedDialActions.filter((action) =>
          action.roles.includes('TRAINEE')
        );
      default:
        assertNever(session?.user.role);
    }
  }

  const actions = getActions();

  if (!actions) return null;

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
