'use client';

import { useMessage } from '@/components/Providers/MessageProvider';
import { SmallConfirmCard } from '@/components/SmallConfirmCard';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import { Users } from '@/lib/prisma/users';
import { update } from '@/lib/response/fetchUtil';
import { MessageType } from '@/lib/response/responseUtil';
import { FilterAlt } from '@mui/icons-material';

import {
  Box,
  IconButton,
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
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { $Enums, User } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface Props extends DictProps {
  users: Users;
}

type Order = 'asc' | 'desc';

type TableHeader = Exclude<
  keyof Users[number],
  'image' | 'id' | 'countryId' | 'titleId' | 'profileCompleted'
>;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// Ok cool easter egg for next group, hf
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  // eslint-disable-next-line no-unused-vars
  a: { [key in Key]: string | Date | null | boolean },
  // eslint-disable-next-line no-unused-vars
  b: { [key in Key]: string | Date | null | boolean }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function checkFilterConditions(
  user: User,
  headerFilters: [string, string, string]
) {
  return (
    user.name?.toLowerCase().indexOf(headerFilters[0].toLowerCase()) !== -1 &&
    user.email?.toLowerCase().indexOf(headerFilters[1].toLowerCase()) !== -1 &&
    user.role.toLowerCase().indexOf(headerFilters[2].toLowerCase()) !== -1
  );
}

export default function UserList({ lang, users }: Props) {
  const { t } = useTranslation(lang, 'admin');
  const { notify } = useMessage();
  const router = useRouter();
  const { palette } = useTheme();

  const [page, setPage] = useState(0);
  const [visibleRowsPerPage, setVisibleRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<TableHeader>('name');
  const [order, setOrder] = useState<Order>('asc');
  // list of users used to keep track of user role changes before saving
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [displayFilterRow, setDisplayFilterRow] = useState(false);
  const [headerFilters, setHeaderFilters] = useState<[string, string, string]>([
    '',
    '',
    '',
  ]);

  useEffect(() => {
    setFilteredUsers((prevFilteredUsers) =>
      users
        .map(
          (user) => prevFilteredUsers.find((usr) => usr.id === user.id) ?? user
        )
        .filter((user) => checkFilterConditions(user, headerFilters))
    );
  }, [users, headerFilters]);

  const visibleUsers = useMemo(
    () =>
      filteredUsers
        .sort(getComparator(order, orderBy))
        .slice(
          page * visibleRowsPerPage,
          page * visibleRowsPerPage + visibleRowsPerPage
        ),
    [order, orderBy, page, visibleRowsPerPage, filteredUsers]
  );

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
    const newRowsPerPage = Number(event.target.value);
    const newPage = Math.min(
      page,
      Math.ceil(filteredUsers.length / newRowsPerPage) - 1
    );

    setPage(newPage);
    setVisibleRowsPerPage(newRowsPerPage);
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
      notify({
        message: t('EditUsers.failedToUpdateUser'),
        messageType: MessageType.ERROR,
      });
    }
  }

  const tableHeaders: TableHeader[] = ['name', 'email', 'role'];

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * visibleRowsPerPage - filteredUsers.length)
      : 0;

  return (
    <div
      style={{
        border: '1px solid lightGrey',
        borderRadius: '5px',
        padding: '1rem',
      }}
    >
      <Box sx={{ display: 'flex', paddingBottom: '1rem' }}>
        <Typography variant="h2">{t('EditUsers.label')}</Typography>
        <Tooltip
          title={
            displayFilterRow
              ? t('EditUsers.filterHideLabel')
              : t('EditUsers.filterToggleLabel')
          }
        >
          <IconButton
            data-testid="filter-button"
            sx={{ marginLeft: 'auto' }}
            onClick={() => {
              setDisplayFilterRow((prev) => !prev);
              setHeaderFilters(['', '', '']);
            }}
          >
            <FilterAlt />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer>
        <Table aria-label="user table">
          <TableHead>
            <TableRow>
              {tableHeaders.map((headerKey, keyIndex) => (
                <TableCell
                  sx={{ width: `${100 / tableHeaders.length}%` }}
                  sortDirection={orderBy === headerKey ? 'asc' : 'desc'}
                  key={headerKey}
                >
                  <TableSortLabel
                    onClick={(event) => handleRequestSort(event, headerKey)}
                    direction={orderBy === headerKey ? order : 'asc'}
                    active={orderBy === headerKey}
                  >
                    {' '}
                    {t(`EditUsers.tableHeaders.${headerKey}`)}
                  </TableSortLabel>
                  {displayFilterRow && (
                    <Tooltip
                      placement="bottom-start"
                      title={t('EditUsers.searchTooltip', {
                        headerValue: headerKey,
                      })}
                    >
                      <TextField
                        onChange={(event) => {
                          setHeaderFilters(
                            (prevFilters) =>
                              prevFilters.map((filter, index) =>
                                index === keyIndex ? event.target.value : filter
                              ) as typeof headerFilters
                          );
                        }}
                        sx={{
                          marginTop: '0.15rem',
                          display: 'block',
                          '& .MuiInputBase-input': {
                            padding: '0.35rem',
                            fontSize: '0.75rem',
                          },
                        }}
                        inputProps={{
                          'data-testid': `filter-input-${t(
                            `EditUsers.tableHeaders.${headerKey}`
                          )}`,
                        }}
                        placeholder={t(`EditUsers.tableHeaders.${headerKey}`)}
                      />
                    </Tooltip>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleUsers.map((user, userIndex) => (
              <TableRow key={user.id}>
                <TableCell component="th" scope="row">
                  <Link
                    href={`profile/${user.id}`}
                    style={{
                      textDecoration: 'none',
                      color: palette.black.main,
                    }}
                  >
                    {user?.name ?? '-'}
                  </Link>
                </TableCell>
                <TableCell component="th" scope="row">
                  {user?.email ?? '-'}
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
                      setFilteredUsers((prevUsers) =>
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
                      filteredUsers[page * visibleRowsPerPage + userIndex].role
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
                    users.find((filteredUser) => filteredUser.id === user.id)
                      ?.role && (
                    <SmallConfirmCard
                      confirmTooltip={t('EditUsers.confirmCard.confirm')}
                      cancelTooltip={t('EditUsers.confirmCard.cancel')}
                      onCancel={() =>
                        setFilteredUsers((prevUsers) =>
                          prevUsers.map((prevUser, index) =>
                            index === page * visibleRowsPerPage + userIndex
                              ? {
                                  ...user,
                                  role:
                                    users.find((u) => u.id === prevUser.id)
                                      ?.role ?? prevUser.role,
                                }
                              : prevUser
                          )
                        )
                      }
                      onSubmit={async () => {
                        await handleUserRoleChange(
                          user.id,
                          filteredUsers[page * visibleRowsPerPage + userIndex]
                            .role
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
        count={filteredUsers.length}
        rowsPerPage={visibleRowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeVisibleRows}
      />
    </div>
  );
}
