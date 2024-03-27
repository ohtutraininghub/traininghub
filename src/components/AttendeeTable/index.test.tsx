import AttendeeTable from '.';
import { renderWithTheme } from '@/lib/test-utils';
import { UserNamesAndIds } from '@/lib/prisma/users';
import { RequestsAndUserNames } from '@/lib/prisma/requests';
import { screen } from '@testing-library/react';

const enrolledStudents: UserNamesAndIds = [
  {
    name: 'Terry Tester',
    userId: '123a',
    isParticipating: true,
  },
  {
    name: 'Harper Hacker',
    userId: '123b',
    isParticipating: true,
  },
  {
    name: 'Coby Coder',
    userId: '123c',
    isParticipating: true,
  },
  {
    name: 'Dana Developer',
    userId: '123d',
    isParticipating: false,
  },
  {
    name: 'Avery Automator',
    userId: '123e',
    isParticipating: false,
  },
];

const requestList: RequestsAndUserNames = [
  {
    id: 'req1',
    user: {
      name: 'Terry Tester',
    },
    name: 'Terry Tester',
    userId: 'requester1',
    courseId: 'course1',
    date: new Date('2021-10-10T10:00:00'),
    isParticipating: false,
  },
  {
    id: 'req2',
    user: {
      name: 'Harper Hacker',
    },
    name: 'Harper Hacker',
    userId: 'requester2',
    courseId: 'course2',
    date: new Date('2021-11-10T10:00:00'),
    isParticipating: false,
  },
];

const testCourse = {
  id: 'cloeouh4x0000qiexq8tqzvh8',
  name: 'Git Fundamentals',
  description:
    'This course will walk you through the fundamentals of using Git for version control. You will learn how to create a local Git repository, commit files and push your changes to a remote repository. The course will introduce you to concepts like the working copy and the staging area and teach you how to organise you repository using tags and branches. You will learn how to make pull requests and merge branches, and tackle merge conflicts when they arise.',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-02T00:00:00Z',
  maxStudents: 3,
  createdById: 'cloeouh4x0000qiexq8tqzvk3',
};

jest.mock('../../lib/i18n/client', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

const mockFetch = jest.fn((...args: any[]) =>
  Promise.resolve({
    json: () => Promise.resolve({ args: args }),
    ok: true,
  })
);

jest.mock('../../lib/response/fetchUtil', () => ({
  update: (...args: any[]) => mockFetch(...args),
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      refresh: jest.fn(),
    };
  },
}));

const noEnrolledStudentsText = 'No enrolled students';
const noRequestsText = 'No requests';

const lang = 'en';

describe('AttendeeTable component', () => {
  describe('When displaying enrollments', () => {
    it('Displays all course attendees', async () => {
      renderWithTheme(
        <AttendeeTable
          courseId={testCourse.id}
          attendees={enrolledStudents}
          noAttendeesText={noEnrolledStudentsText}
          lang={lang}
        />
      );

      enrolledStudents.forEach((student) => {
        if (student.name) {
          expect(screen.getByText(student.name)).toBeInTheDocument();
        }
      });
    });

    it('Displays participation checkboxes to all course attendees', async () => {
      renderWithTheme(
        <AttendeeTable
          courseId={testCourse.id}
          attendees={enrolledStudents}
          noAttendeesText={noEnrolledStudentsText}
          lang={lang}
        />
      );

      const checkbox = screen.getAllByTestId('participation-checkbox');
      expect(checkbox).toHaveLength(enrolledStudents.length);
    });

    it('Displays message text but no table if the list with enrolled students is empty', async () => {
      renderWithTheme(
        <AttendeeTable
          courseId={testCourse.id}
          attendees={[]}
          noAttendeesText={noEnrolledStudentsText}
          lang={lang}
        />
      );

      const noStudentsText = screen.getByText(noEnrolledStudentsText);
      expect(noStudentsText).toBeInTheDocument();

      const nameTable = screen.queryByRole('table', {
        name: 'enrolled students table',
      });
      expect(nameTable).not.toBeInTheDocument();
    });
  });

  describe('When displaying requesters', () => {
    it('Displays all course requesters', async () => {
      renderWithTheme(
        <AttendeeTable
          courseId={testCourse.id}
          attendees={requestList}
          noAttendeesText={noRequestsText}
          lang={lang}
        />
      );

      requestList.forEach((request) => {
        expect(request.name).toBeDefined();
        if (request.name) {
          expect(screen.getByText(request.name)).toBeInTheDocument();
        }
      });
    });
    it('Displays all request dates', async () => {
      renderWithTheme(
        <AttendeeTable
          courseId={testCourse.id}
          attendees={requestList}
          noAttendeesText={noRequestsText}
          lang={lang}
        />
      );

      requestList.forEach((request) => {
        expect(
          screen.getByText(request.date.toDateString())
        ).toBeInTheDocument();
      });
    });
  });
});
