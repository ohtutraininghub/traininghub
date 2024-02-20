import React from 'react';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/lib/test-utils';
import { User, Role } from '@prisma/client';
import ProfileView from './index';
import { useSession } from 'next-auth/react';

// Mocking translation and fetch utilities
jest.mock('../../lib/i18n/client', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

const adminUser: User = {
  id: '123a',
  name: 'Ada Admin',
  email: 'admin@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.ADMIN,
};

const trainerUser: User = {
  id: '123b',
  name: 'Teddy Trainer',
  email: 'trainer@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.TRAINER,
};

const template = {
  id: '1234',
  name: 'New course',
  description: 'A test course',
  summary: 'All you ever wanted to know about testing!',
  tags: [{ id: '1', name: 'Testing' }],
  maxStudents: 55,
  createdById: trainerUser.id,
  image: 'http://test-image.com',
};
const courseStartPast = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
const courseEndPast = new Date(Date.now() - 24 * 60 * 60 * 1000);
const courseStartFuture = new Date(Date.now() + 24 * 60 * 60 * 1000);
const courseEndFuture = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
const oneDayBeforeStart = new Date();

// set three courses with different end and start dates to make them show up
// in different dropdowns in ProfileView
const testCourses = [
  {
    id: '1234',
    createdById: trainerUser.id,
    name: 'New course',
    description: 'A test course',
    summary: 'All you ever wanted to know about testing!',
    startDate: courseStartPast,
    endDate: courseEndPast,
    lastEnrollDate: oneDayBeforeStart,
    lastCancelDate: oneDayBeforeStart,
    maxStudents: 55,
    tags: [
      { id: '1', name: 'Testing' },
      { id: '2', name: 'Git' },
    ],
    image: 'http://test-image.com',
  },
  {
    id: '5678',
    createdById: trainerUser.id,
    name: 'Another course',
    description: 'Another test course',
    summary: 'All you ever wanted to know about testing!',
    startDate: courseStartPast,
    endDate: courseEndFuture,
    lastEnrollDate: oneDayBeforeStart,
    lastCancelDate: oneDayBeforeStart,
    maxStudents: 55,
    tags: [
      { id: '3', name: 'Robot Framework' },
      { id: '4', name: 'Jest' },
    ],
    image: 'http://test-image.com',
  },
  {
    id: '91011',
    createdById: adminUser.id,
    name: 'Yet another course',
    description: 'Yet another test course',
    summary: 'All you ever wanted to know about testing!',
    startDate: courseStartFuture,
    endDate: courseEndFuture,
    lastEnrollDate: oneDayBeforeStart,
    lastCancelDate: oneDayBeforeStart,
    maxStudents: 55,
    tags: [
      { id: '5', name: 'Cypress' },
      { id: '6', name: 'E2E' },
    ],
    image: 'http://test-image.com',
  },
];

const traineeUser = {
  id: '123c',
  name: 'Taylor Trainee',
  email: 'taylor@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.TRAINEE,
  courses: testCourses,
};

describe('ProfileView Tests', () => {
  it('should render courses in the correct dropdowns', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: traineeUser,
      },
      status: 'authenticated',
    });

    renderWithTheme(
      <ProfileView
        lang="en"
        userDetails={{
          name: traineeUser.name,
          email: traineeUser.email,
          image: traineeUser.image,
        }}
        courses={testCourses}
        createdCourses={[]}
        users={[]}
        children={[]}
        templates={[]}
        tags={[]}
      />
    );

    const myCourses = screen.getByText('ProfileView.label.myCourses');
    const upcomingCourses = screen.getByText(
      'ProfileView.header.upcomingCourses (1)'
    );
    const inProgressCourses = screen.getByText(
      'ProfileView.header.coursesInprogress (1)'
    );
    expect(myCourses).toBeInTheDocument();
    expect(upcomingCourses).toBeInTheDocument();
    expect(inProgressCourses).toBeInTheDocument();
  });
});
