import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '@/lib/test-utils';
import { Country, Role, Title } from '@prisma/client';
import ProfileView from './index';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import UserList from '../UserList';

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
  useParams: jest.fn(),
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
  countryId: '1',
  titleId: '1',
  profileCompleted: true,
};

const trainerUser = {
  id: '123b',
  name: 'Teddy Trainer',
  email: 'trainer@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.TRAINER,
  countryId: '1',
  titleId: '1',
  profileCompleted: true,
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
    slackChannelId: '123',
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
    slackChannelId: '1234',
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
    slackChannelId: '1235',
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
  countryId: '1',
  titleId: '1',
  profileCompleted: true,
};

describe('ProfileView Tests', () => {
  it('should render correct dropdowns and tabs for trainee', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: traineeUser.id });
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
          country: traineeUser.countryId,
          title: traineeUser.titleId,
        }}
        courses={testCourses}
        createdCourses={[]}
        users={[]}
        children={[]}
        templates={[]}
        tags={[]}
        countries={[]}
        titles={[]}
      />
    );

    const myEnrollments = screen.getByText('ProfileView.label.myEnrollments');
    const myCourses = screen.queryByText('ProfileView.label.myCourses');
    const upcomingCourses = screen.getByText(
      'ProfileView.header.upcomingCourses (1)'
    );
    const inProgressCourses = screen.getByText(
      'ProfileView.header.coursesInprogress (1)'
    );
    expect(myEnrollments).toBeInTheDocument();
    expect(myCourses).not.toBeInTheDocument();
    expect(upcomingCourses).toBeInTheDocument();
    expect(inProgressCourses).toBeInTheDocument();
  });
  it('should render correct dropdowns for trainer', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: trainerUser.id });
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
          country: trainerUser.countryId,
          title: trainerUser.titleId,
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
        countries={[]}
        titles={[]}
      />
    );

    const myEnrollments = screen.getByText('ProfileView.label.myEnrollments');
    const myCourses = screen.getByText('ProfileView.label.myCourses');
    const upcomingCourses = screen.getByText(
      'ProfileView.header.upcomingCourses (1)'
    );
    const inProgressCourses = screen.getByText(
      'ProfileView.header.coursesInprogress (1)'
    );
    expect(myEnrollments).toBeInTheDocument();
    expect(myCourses).toBeInTheDocument();
    expect(upcomingCourses).toBeInTheDocument();
    expect(inProgressCourses).toBeInTheDocument();

    fireEvent.click(myCourses);
    const upcomingCreatedCourses = screen.getByText(
      'ProfileView.header.upcomingCreatedCourses (1)' // trainers created courses are in the past
    );
    const endedCreatedCourses = screen.getByText(
      'ProfileView.header.endedCreatedCourses (1)'
    );
    const templatesAdmin = screen.queryByText(
      'ProfileView.header.templatesAdmin (1)'
    );
    const templatesTrainer = screen.getByText(
      'ProfileView.header.templatesTrainer (1)'
    );
    const courseChip = screen.getByTestId('courseTimer.5678');
    expect(upcomingCreatedCourses).toBeInTheDocument();
    expect(courseChip).toHaveTextContent('In Progress');
    expect(courseChip).toHaveStyle('background: "success"');
    expect(endedCreatedCourses).toBeInTheDocument();
    expect(templatesAdmin).not.toBeInTheDocument();
    expect(templatesTrainer).toBeInTheDocument();
  });
  it('should render correct dropdowns for admin', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: adminUser.id });
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
          country: adminUser.countryId,
          title: adminUser.titleId,
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
        countries={[]}
        titles={[]}
      />
    );

    const myEnrollments = screen.getByText('ProfileView.label.myEnrollments');
    const myCourses = screen.getByText('ProfileView.label.myCourses');
    const upcomingCourses = screen.getByText(
      'ProfileView.header.upcomingCourses (1)'
    );
    const inProgressCourses = screen.getByText(
      'ProfileView.header.coursesInprogress (1)'
    );
    expect(myEnrollments).toBeInTheDocument();
    expect(myCourses).toBeInTheDocument();
    expect(upcomingCourses).toBeInTheDocument();
    expect(inProgressCourses).toBeInTheDocument();

    fireEvent.click(myCourses);
    const upcomingCreatedCourses = screen.getByText(
      'ProfileView.header.upcomingCreatedCourses (1)'
    );
    const endedCreatedCourses = screen.getByText(
      'ProfileView.header.endedCreatedCourses (0)' // there are no ended courses that were created by the admin
    );
    const templatesAdmin = screen.getByText(
      'ProfileView.header.templatesAdmin (1)'
    );
    const templatesTrainer = screen.queryByText(
      'ProfileView.header.templatesTrainer (1)'
    );
    expect(upcomingCreatedCourses).toBeInTheDocument();
    expect(endedCreatedCourses).toBeInTheDocument();
    expect(templatesAdmin).toBeInTheDocument();
    expect(templatesTrainer).not.toBeInTheDocument();
  });
  it('should be possible to access admin dashboard as an admin', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: adminUser.id });
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
          country: adminUser.countryId,
          title: adminUser.titleId,
        }}
        courses={[]}
        createdCourses={[]}
        users={[traineeUser, trainerUser]}
        templates={[]}
        tags={[
          { id: '1', name: 'Testing' },
          { id: '2', name: 'Git' },
        ]}
        countries={[{ id: '1', name: 'Finland', countryCode: 'FI' }]}
        titles={[{ id: '1', name: 'Employee' }]}
      >
        <UserList
          users={[traineeUser, trainerUser]}
          lang="en"
          countries={[{ id: '1', name: 'Finland', countryCode: 'FI' }]}
          titles={[{ id: '1', name: 'Employee' }]}
        />
      </ProfileView>
    );

    const adminDashboard = screen.getByText('ProfileView.label.adminDashboard');
    fireEvent.click(adminDashboard);

    const users = screen.getByText('EditUsers.label');
    expect(users).toBeInTheDocument();
  });
});
