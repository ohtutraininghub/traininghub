'use client';

import { SmallConfirmCard } from '@/components/SmallConfirmCard';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import { Users } from '@/lib/prisma/users';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { update } from '@/lib/response/fetchUtil';

import {
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import { $Enums } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props extends DictProps {
  users: Users;
}

export default function EditUsers({ lang, users }: Props) {
  const { t } = useTranslation(lang, 'admin');
  const router = useRouter();
  const [userRoles, setUserRoles] = useState<$Enums.Role[]>(
    users.map((user) => user.role)
  );

  async function handleUserRoleChange(userId: string, newRole: $Enums.Role) {
    try {
      await update('/api/user', { userId, newRole });
    } catch (error) {
      return handleCommonErrors(error);
    }
  }

  const tableHeaders: Exclude<keyof Users[number], 'image' | 'id'>[] = [
    'name',
    'email',
    'emailVerified',
    'role',
  ];

  return (
    <Paper>
      <Toolbar>
        <Typography>{t('EditUsers.label')}</Typography>
      </Toolbar>

      <TableContainer>
        <Table aria-label="user table">
          <TableHead>
            <TableRow>
              {tableHeaders.map((headerKey) => (
                <TableCell
                  key={headerKey}
                  align={headerKey === 'emailVerified' ? 'center' : 'left'}
                >
                  {t(`EditUsers.tableHeaders.${headerKey}`)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, userIndex) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  {user?.name ?? '-'}
                </TableCell>
                <TableCell component="th" scope="row">
                  {user?.email ?? '-'}
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {user.emailVerified
                    ? JSON.stringify(user.emailVerified)
                    : '-'}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ display: 'flex', minWidth: '210px' }}
                >
                  <Select
                    sx={{
                      '& .MuiSelect-select': { padding: '0.5rem' },
                    }}
                    fullWidth
                    // eslint-disable-next-line no-unused-vars
                    onChange={(event) => {
                      setUserRoles((prevRoles) =>
                        prevRoles.map((role, index) =>
                          index === userIndex
                            ? (event.target.value as $Enums.Role)
                            : role
                        )
                      );
                    }}
                    value={userRoles[userIndex]}
                  >
                    {Object.keys($Enums.Role).map((enumKey) => (
                      <MenuItem key={enumKey} value={enumKey}>
                        <Typography>{enumKey.toLowerCase()}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                  {user.role !== userRoles[userIndex] && (
                    <SmallConfirmCard
                      confirmTooltip="Confirm changes"
                      cancelTooltip="Cancel changes"
                      onCancel={() =>
                        setUserRoles(users.map((user) => user.role))
                      }
                      onSubmit={async () => {
                        await handleUserRoleChange(
                          user.id,
                          userRoles[userIndex]
                        );
                        router.refresh();
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
