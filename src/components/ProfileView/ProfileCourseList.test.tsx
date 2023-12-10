import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/lib/test-utils';
import ProfileCourseList from './ProfileCourseList';
import { Course } from '@prisma/client';
import userEvent from '@testing-library/user-event';

const testCourses: Course[] = [
  {
    id: '123456789',
    createdById: '7',
    name: 'Introduction to something',
    description: 'Once upon time there was a fox with a box',
    startDate: new Date('2000-01-12T15:00'),
    endDate: new Date('2001-05-12T15:00'),
    lastEnrollDate: null,
    lastCancelDate: null,
    maxStudents: 10,
    image: '',
  },
  {
    id: '223456789',
    createdById: '7',
    name: 'Advanced stuff',
    description: 'And inside the box there was a fox',
    startDate: new Date('2050-01-12T15:00'),
    endDate: new Date('2051-05-12T15:00'),
    lastEnrollDate: null,
    lastCancelDate: null,
    maxStudents: 10,
    image: '',
  },
];

describe('ProfileCourseList component', () => {
  it('has a header and expand/close controls', () => {
    renderWithTheme(
      <ProfileCourseList
        headerText="Foxes everywhere"
        courses={testCourses}
        open={true}
      />
    );
    const headerText = screen.getByTestId('listHeader');
    const controlButton = screen.getByTestId('listControls');
    expect(headerText).toBeInTheDocument();
    expect(controlButton).toBeInTheDocument();
  });

  it('displays a message if the courses list is empty', () => {
    renderWithTheme(
      <ProfileCourseList headerText="My Courses" courses={[]} open={true} />
    );
    const noCoursesText = screen.getByText('No courses to show.');
    expect(noCoursesText).toBeInTheDocument();
  });

  it('renders course information when courses are provided and list open', () => {
    renderWithTheme(
      <ProfileCourseList
        headerText="Foxes everywhere"
        courses={testCourses}
        open={true}
      />
    );
    testCourses.forEach((course) => {
      expect(screen.getByText(course.name)).toBeInTheDocument();
    });
  });

  it('does not render course information if list is closed', () => {
    renderWithTheme(
      <ProfileCourseList
        headerText="Foxes everywhere"
        courses={testCourses}
        open={false}
      />
    );
    testCourses.forEach((course) => {
      expect(screen.queryByText(course.name)).toBeNull();
    });
  });

  it('shows the number of courses', () => {
    renderWithTheme(
      <ProfileCourseList
        headerText="Foxes everywhere"
        courses={testCourses}
        open={false}
      />
    );
    expect(screen.getByText('(2)', { exact: false })).toBeInTheDocument();
  });

  it('expands when the toggle is clicked', async () => {
    renderWithTheme(
      <ProfileCourseList
        headerText="Foxes everywhere"
        courses={testCourses}
        open={false}
      />
    );
    const controlButton = screen.getByTestId('listControls');
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
        headerText="Foxes everywhere"
        courses={testCourses}
        open={true}
      />
    );
    const controlButton = screen.getByTestId('listControls');
    testCourses.forEach((course) => {
      expect(screen.getByText(course.name)).toBeInTheDocument();
    });
    await userEvent.click(controlButton);
    testCourses.forEach((course) => {
      expect(screen.queryByText(course.name)).toBeNull();
    });
  });
});
