import AttendeeTable from '.';
import { renderWithTheme } from '@/lib/test-utils';
import { UserNamesAndIds } from '@/lib/prisma/users';
import { screen } from '@testing-library/react';

const enrolledStudents: UserNamesAndIds = [
  {
    name: 'Terry Tester',
    userId: '123a',
  },
  {
    name: 'Harper Hacker',
    userId: '123b',
  },
  {
    name: 'Coby Coder',
    userId: '123c',
  },
  {
    name: 'Dana Developer',
    userId: '123d',
  },
  {
    name: 'Avery Automator',
    userId: '123e',
  },
];

const noEnrolledStudentsText = 'No enrolled students';

describe('AttendeeTable component', () => {
  it('Displays all course attendees', async () => {
    renderWithTheme(
      <AttendeeTable
        attendees={enrolledStudents}
        noAttendeesText={noEnrolledStudentsText}
      />
    );

    enrolledStudents.forEach((student) => {
      expect(screen.getByText(student.name)).toBeInTheDocument();
    });
  });

  it('Displays message text but no table if the list with enrollled students is empty', async () => {
    renderWithTheme(
      <AttendeeTable attendees={[]} noAttendeesText={noEnrolledStudentsText} />
    );

    const noStudentsText = screen.getByText(noEnrolledStudentsText);
    expect(noStudentsText).toBeInTheDocument();

    const nameTable = screen.queryByRole('table', {
      name: 'enrolled students table',
    });
    expect(nameTable).not.toBeInTheDocument();
  });
});
