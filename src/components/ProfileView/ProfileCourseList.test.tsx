import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/lib/test-utils';
import ProfileCourseList from './ProfileCourseList';
import { Course } from '@prisma/client';
import userEvent from '@testing-library/user-event';
import { Message } from '@mui/icons-material';
import { MessageType } from '@/lib/response/responseUtil';

const testCourses: Course[] = [
  {
    id: '123456789',
    createdById: '7',
    name: 'Introduction to something',
    description: 'Once upon time there was a fox with a box',
    summary: 'A course about something',
    startDate: new Date('2000-01-12T15:00'),
    endDate: new Date('2001-05-12T15:00'),
    lastEnrollDate: null,
    lastCancelDate: null,
    maxStudents: 10,
    image: '',
    slackChannelId: 'C123456782',
  },
  {
    id: '223456789',
    createdById: '7',
    name: 'Advanced stuff',
    description: 'And inside the box there was a fox',
    summary: 'A course about advanced stuff',
    startDate: new Date('2050-01-12T15:00'),
    endDate: new Date('2051-05-12T15:00'),
    lastEnrollDate: null,
    lastCancelDate: null,
    maxStudents: 10,
    image: '',
    slackChannelId: 'C123456789',
  },
];

const mockFetch = jest.fn((...args: any[]) =>
  Promise.resolve({
    json: () => Promise.resolve({ args: args }),
    ok: true,
  })
);
jest.mock('../../lib/response/fetchUtil', () => ({
  post: (...args: any[]) => mockFetch(...args),
}));

jest.mock('next/navigation', () => ({
  useRouter() {},
}));

describe('ProfileCourseList component', () => {
  it('has a header and expand/close controls', () => {
    renderWithTheme(
      <ProfileCourseList
        lang="en"
        headerText="Foxes everywhere"
        courses={testCourses}
        open={true}
        id={'testId'}
      />
    );
    const headerText = screen.getByTestId('listHeader.testId');
    const controlButton = screen.getByTestId('listControls.testId');
    expect(headerText).toBeInTheDocument();
    expect(controlButton).toBeInTheDocument();
  });

  it('displays a message if the courses list is empty', () => {
    renderWithTheme(
      <ProfileCourseList
        lang="en"
        headerText="My Courses"
        courses={[]}
        open={true}
        id={'testId'}
      />
    );
    const noCoursesText = screen.getByText('No courses to show.');
    expect(noCoursesText).toBeInTheDocument();
  });

  it('renders course information when courses are provided and list open', () => {
    renderWithTheme(
      <ProfileCourseList
        lang="en"
        headerText="Foxes everywhere"
        courses={testCourses}
        open={true}
        id={'testId'}
      />
    );
    testCourses.forEach((course) => {
      expect(screen.getByText(course.name)).toBeInTheDocument();
    });
  });

  it('does not render course information if list is closed', () => {
    renderWithTheme(
      <ProfileCourseList
        lang="en"
        headerText="Foxes everywhere"
        courses={testCourses}
        open={false}
        id={'testId'}
      />
    );
    testCourses.forEach((course) => {
      expect(screen.queryByText(course.name)).toBeNull();
    });
  });

  it('shows the number of courses', () => {
    renderWithTheme(
      <ProfileCourseList
        lang="en"
        headerText="Foxes everywhere"
        courses={testCourses}
        open={false}
        id={'testId'}
      />
    );
    expect(screen.getByText('(2)', { exact: false })).toBeInTheDocument();
  });

  it('expands when the toggle is clicked', async () => {
    renderWithTheme(
      <ProfileCourseList
        lang="en"
        headerText="Foxes everywhere"
        courses={testCourses}
        open={false}
        id={'testId'}
      />
    );
    const controlButton = screen.getByTestId('listControls.testId');
    testCourses.forEach((course) => {
      expect(screen.queryByText(course.name)).toBeNull();
    });
    await userEvent.click(controlButton);
    testCourses.forEach((course) => {
      expect(screen.getByText(course.name)).toBeInTheDocument();
    });
  });

  it('list collapses when control is clicked', async () => {
    renderWithTheme(
      <ProfileCourseList
        lang="en"
        headerText="Foxes everywhere"
        courses={testCourses}
        open={true}
        id={'testId'}
      />
    );
    const controlButton = screen.getByTestId('listControls.testId');
    testCourses.forEach((course) => {
      expect(screen.getByText(course.name)).toBeInTheDocument();
    });
    await userEvent.click(controlButton);
    testCourses.forEach((course) => {
      expect(screen.queryByText(course.name)).toBeNull();
    });
  });
});
