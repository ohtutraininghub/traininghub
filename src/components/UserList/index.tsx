'use client';

import { useMessage } from '@/components/Providers/MessageProvider';
import { SmallConfirmCard } from '@/components/SmallConfirmCard';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import { Users } from '@/lib/prisma/users';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { update } from '@/lib/response/fetchUtil';
import { MessageType } from '@/lib/response/responseUtil';

import {
  Box,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { $Enums, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

interface Props extends DictProps {
  users: Users;
}

type Order = 'asc' | 'desc';

type TableHeader = Exclude<keyof Users[number], 'image' | 'id'>;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  // eslint-disable-next-line no-unused-vars
  a: { [key in Key]: string | Date | null },
  // eslint-disable-next-line no-unused-vars
  b: { [key in Key]: string | Date | null }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function UserList({ lang, users }: Props) {
  const { t } = useTranslation(lang, 'admin');
  const { notify } = useMessage();
  const router = useRouter();

  const [page, setPage] = useState(0);
  const [visibleRowsPerPage, setVisibleRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<TableHeader>('name');
  const [order, setOrder] = useState<Order>('asc');
  // list of users used to keep track of user right changes before saving
  const [tempUsers, setTempUsers] = useState<User[]>(users);

  function handleRequestSort(
    _event: React.MouseEvent<unknown>,
    property: TableHeader
  ) {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }

  function handleChangePage(_event: unknown, newPage: number) {
    setPage(newPage);
  }

  function handleChangeVisibleRows(event: React.ChangeEvent<HTMLInputElement>) {
    setVisibleRowsPerPage(Number(event.target.value));
  }

  async function handleUserRoleChange(userId: string, newRole: $Enums.Role) {
    try {
      await update('/api/user', { userId, newRole });
      router.refresh();
      notify({
        message: t('EditUsers.infoText'),
        messageType: MessageType.INFO,
        disableAutoHide: true,
      });
    } catch (error) {
      return handleCommonErrors(error);
    }
  }

  const tableHeaders: TableHeader[] = [
    'name',
    'email',
    'emailVerified',
    'role',
  ];

  const visibleUsers = useMemo(
    () =>
      users
        .sort(getComparator(order, orderBy))
        .slice(
          page * visibleRowsPerPage,
          page * visibleRowsPerPage + visibleRowsPerPage
        ),
    [order, orderBy, page, users, visibleRowsPerPage]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * visibleRowsPerPage - users.length) : 0;

  return (
    <div
      style={{
        border: '1px solid lightGrey',
        borderRadius: '5px',
        padding: '1rem',
      }}
    >
      <Box sx={{ paddingBottom: '1rem' }}>
        <Typography variant="h4" component="h2">
          {t('EditUsers.label')}
        </Typography>
      </Box>

      <TableContainer>
        <Table aria-label="user table">
          <TableHead>
            <TableRow>
              {tableHeaders.map((headerKey) => (
                <TableCell
                  sortDirection={orderBy === headerKey ? 'asc' : 'desc'}
                  key={headerKey}
                  align={headerKey === 'emailVerified' ? 'center' : 'left'}
                >
                  <TableSortLabel
                    onClick={(event) => handleRequestSort(event, headerKey)}
                    direction={orderBy === headerKey ? order : 'asc'}
                    active={orderBy === headerKey}
                  >
                    {' '}
                    {t(`EditUsers.tableHeaders.${headerKey}`)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleUsers.map((user, userIndex) => (
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
                    data-testid={`${user.id}-role-select`}
                    sx={{
                      '& .MuiSelect-select': {
                        padding: '0.5rem',
                      },
                    }}
                    fullWidth
                    onChange={(event) => {
                      setTempUsers((prevUsers) =>
                        prevUsers.map((prevUser, index) =>
                          index === page * visibleRowsPerPage + userIndex
                            ? {
                                ...user,
                                role: event.target.value as $Enums.Role,
                              }
                            : prevUser
                        )
                      );
                    }}
                    value={
                      tempUsers[page * visibleRowsPerPage + userIndex].role
                    }
                  >
                    {Object.keys($Enums.Role).map((enumKey) => (
                      <MenuItem key={enumKey} value={enumKey}>
                        <Typography sx={{ fontSize: '0.875rem' }}>
                          {enumKey.toLowerCase()}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>

                  {user.role !==
                    tempUsers.find((tempUser) => tempUser.id === user.id)
                      ?.role && (
                    <SmallConfirmCard
                      confirmTooltip={t('EditUsers.confirmCard.confirm')}
                      cancelTooltip={t('EditUsers.confirmCard.cancel')}
                      onCancel={() =>
                        setTempUsers((prevUsers) =>
                          prevUsers.map((prevUser, index) =>
                            index === page * visibleRowsPerPage + userIndex
                              ? { ...user, role: user.role }
                              : prevUser
                          )
                        )
                      }
                      onSubmit={async () => {
                        await handleUserRoleChange(
                          user.id,
                          tempUsers[page * visibleRowsPerPage + userIndex].role
                        );
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 72 * emptyRows, // 72 is the single row height
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={visibleRowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeVisibleRows}
      />
    </div>
  );
}
