'use client';

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

interface Props {
  attendees: UserNamesAndIds | null;
  noAttendeesText: string;
}

export default function AttendeeTable({ attendees, noAttendeesText }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!attendees) return null;

  if (attendees.length === 0) {
    return (
      <Typography variant="body2" sx={{ my: 2 }}>
        {noAttendeesText}
      </Typography>
    );
  }

  const handleChangePage = (_event: MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - attendees.length) : 0;

  const rowHeight = 53; // Baseline row height for MUI tables + border

  return (
    <Paper sx={{ my: 2 }}>
      <TableContainer data-testid="enrolled-students-table" sx={{backgroundColor: "coverBlue.dark"}}>
        <Table aria-label="enrolled students table" sx={{"& .MuiTableCell-root, .MuiSvgIcon-root, .MuiButtonBase-root": {
          color: "white.main",
    }}}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendees
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((attendee) => (
                <TableRow key={attendee.userId}>
                  <TableCell>{attendee.name}</TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: rowHeight * emptyRows,
                }}
              >
                <TableCell colSpan={1} />
              </TableRow>
            )}
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
