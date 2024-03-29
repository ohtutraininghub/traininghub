'use client';

import { DictProps } from '@/lib/i18n';
import { RequestsAndUserNames } from '@/lib/prisma/requests';
import { UserNamesAndIds } from '@/lib/prisma/users';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { post, remove } from '@/lib/response/fetchUtil';
import { useMessage } from '../Providers/MessageProvider';
import { useRouter } from 'next/navigation';

type Attendees = UserNamesAndIds | RequestsAndUserNames;
type Attendee = Attendees[0];

interface Props extends DictProps {
  courseId: string;
  attendees: Attendees;
  noAttendeesText: string;
}

export default function AttendeeTable({
  courseId,
  attendees,
  noAttendeesText,
  lang,
}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { t } = useTranslation(lang, 'components');
  const { notify } = useMessage();
  const router = useRouter();

  if (!attendees) return null;

  if (attendees.length === 0) {
    return (
      <Typography variant="body2" sx={{ my: 2 }}>
        {noAttendeesText}
      </Typography>
    );
  }

  const requests = attendees[0].hasOwnProperty('date')
    ? (attendees as RequestsAndUserNames)
    : null;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeParticipation = async (attendee: Attendee) => {
    const responseJson = attendee.isParticipating
      ? await remove('/api/course/participation', {
          courseId: courseId,
          userId: attendee.userId,
        })
      : await post('/api/course/participation', {
          courseId: courseId,
          userId: attendee.userId,
        });
    notify(responseJson);
    router.refresh();
  };

  return (
    <Paper sx={{ my: 2 }}>
      <TableContainer
        data-testid="enrolled-students-table"
        sx={{ backgroundColor: 'coverBlue.dark' }}
      >
        <Table
          aria-label="enrolled students table"
          sx={{
            '& .MuiTableCell-root, .MuiSvgIcon-root, .MuiButtonBase-root': {
              color: 'white.main',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>{t('AttendeeList.header.name')}</TableCell>
              {requests && (
                <TableCell align="right">
                  {t('AttendeeList.header.requestDate')}
                </TableCell>
              )}
              {!requests && (
                <TableCell align="right">
                  {t('AttendeeList.header.participation')}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {attendees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((attendee) => (
                <TableRow key={attendee.userId}>
                  <TableCell>{attendee.name}</TableCell>
                  {requests && (
                    <TableCell align="right">
                      {requests
                        .find((request) => request.userId === attendee.userId)
                        ?.date.toDateString()}
                    </TableCell>
                  )}
                  {!requests && (
                    <TableCell align="right">
                      <input
                        type="checkbox"
                        data-testid="participation-checkbox"
                        style={{
                          transform: 'scale(1.25)',
                        }}
                        checked={attendee.isParticipating}
                        onChange={() => handleChangeParticipation(attendee)}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                count={attendees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderBottom: 'none',
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}
