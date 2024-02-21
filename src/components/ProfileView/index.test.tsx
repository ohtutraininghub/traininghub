import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '@/lib/test-utils';
import { Role } from '@prisma/client';
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

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
}));

jest.mock('../../lib/response/responseUtil', () => ({
  MessageType: {},
}));

const adminUser = {
  id: '123a',
  name: 'Ada Admin',
  email: 'admin@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.ADMIN,
};

const trainerUser = {
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
  createdBy: trainerUser,
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
  it('should render correct dropdowns for trainee', async () => {
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
    const upcomingCreatedCourses = screen.queryByText(
      'ProfileView.header.upcomingCreatedCourses'
    );
    const tempaltesAdmin = screen.queryByText(
      'ProfileView.header.templatesAdmin'
    );
    const tempaltesTrainer = screen.queryByText(
      'ProfileView.header.templatesTrainer'
    );
    expect(myCourses).toBeInTheDocument();
    expect(upcomingCourses).toBeInTheDocument();
    expect(inProgressCourses).toBeInTheDocument();
    expect(upcomingCreatedCourses).not.toBeInTheDocument();
    expect(tempaltesAdmin).not.toBeInTheDocument();
    expect(tempaltesTrainer).not.toBeInTheDocument();
  });
  it('should render correct dropdowns for trainer', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: trainerUser,
      },
      status: 'authenticated',
    });

    renderWithTheme(
      <ProfileView
        lang="en"
        userDetails={{
          name: trainerUser.name,
          email: trainerUser.email,
          image: trainerUser.image,
        }}
        courses={testCourses}
        createdCourses={
          testCourses.filter(
            (course) => course.createdById === trainerUser.id
          ) || []
        }
        users={[]}
        children={[]}
        templates={[template]}
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
    const upcomingCreatedCourses = screen.getByText(
      'ProfileView.header.upcomingCreatedCourses (0)' // trainers created courses are in the past
    );
    const tempaltesAdmin = screen.queryByText(
      'ProfileView.header.templatesAdmin (1)'
    );
    const tempaltesTrainer = screen.getByText(
      'ProfileView.header.templatesTrainer (1)'
    );
    expect(myCourses).toBeInTheDocument();
    expect(upcomingCourses).toBeInTheDocument();
    expect(inProgressCourses).toBeInTheDocument();
    expect(upcomingCreatedCourses).toBeInTheDocument();
    expect(tempaltesAdmin).not.toBeInTheDocument();
    expect(tempaltesTrainer).toBeInTheDocument();
  });
  it('should render correct dropdowns for admin', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: adminUser,
      },
      status: 'authenticated',
    });

    renderWithTheme(
      <ProfileView
        lang="en"
        userDetails={{
          name: adminUser.name,
          email: adminUser.email,
          image: adminUser.image,
        }}
        courses={testCourses}
        createdCourses={
          testCourses.filter((course) => course.createdById === adminUser.id) ||
          []
        }
        users={[]}
        children={[]}
        templates={[template]}
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
    const upcomingCreatedCourses = screen.getByText(
      'ProfileView.header.upcomingCreatedCourses (1)'
    );
    const tempaltesAdmin = screen.getByText(
      'ProfileView.header.templatesAdmin (1)'
    );
    const tempaltesTrainer = screen.queryByText(
      'ProfileView.header.templatesTrainer (1)'
    );
    expect(myCourses).toBeInTheDocument();
    expect(upcomingCourses).toBeInTheDocument();
    expect(inProgressCourses).toBeInTheDocument();
    expect(upcomingCreatedCourses).toBeInTheDocument();
    expect(tempaltesAdmin).toBeInTheDocument();
    expect(tempaltesTrainer).not.toBeInTheDocument();
  });
  it('should be possible to access admin dashboard as an admin', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: adminUser,
      },
      status: 'authenticated',
    });

    renderWithTheme(
      <ProfileView
        lang="en"
        userDetails={{
          name: adminUser.name,
          email: adminUser.email,
          image: adminUser.image,
        }}
        courses={[]}
        createdCourses={[]}
        users={[traineeUser, trainerUser]}
        children={[]}
        templates={[]}
        tags={[
          { id: '1', name: 'Testing' },
          { id: '2', name: 'Git' },
        ]}
      />
    );

    const adminDashboard = screen.getByText('ProfileView.label.adminDashboard');
    fireEvent.click(adminDashboard);

    const users = screen.getByText('EditUsers.label');
    expect(users).toBeInTheDocument();
  });
});
