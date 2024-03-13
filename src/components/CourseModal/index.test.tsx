import CourseModal from '.';
import { renderWithTheme } from '@/lib/test-utils';
import { Role, User } from '@prisma/client';
import { CourseWithInfo } from '@/lib/prisma/courses';
import { screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';

const adminUser: User = {
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

const traineeUser = {
  id: '123c',
  name: 'Taylor Trainee',
  email: 'taylor@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.TRAINEE,
};

const upComingCourse: CourseWithInfo = {
  id: '987654cba',
  name: 'Robot Framework Fundamentals',
  description:
    'This course will teach you how to automate the acceptance testing of your software using Robot Framework, a generic, open-source, Python-based automation framework. You will get an introduction to how Robot Framework works and learn how to write tasks utilising keywords, all in an easily readable and human-friendly syntax.',
  summary: 'yesss',
  startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  lastEnrollDate: null,
  lastCancelDate: null,
  maxStudents: 10,
  tags: [],
  _count: {
    students: 5,
    requesters: 0,
  },
  createdById: adminUser.id,
  createdBy: adminUser,
  image: '',
  slackChannelId: '',
};

const pastCourse: CourseWithInfo = {
  id: '987654abc',
  name: 'Git Fundamentals',
  description:
    'This course will walk you through the fundamentals of using Git for version control. You will learn how to create a local Git repository, commit files and push your changes to a remote repository. The course will introduce you to concepts like the working copy and the staging area and teach you how to organise you repository using tags and branches. You will learn how to make pull requests and merge branches, and tackle merge conflicts when they arise.',
  summary: 'Learn the basics of Git',
  startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
  lastEnrollDate: null,
  lastCancelDate: null,
  maxStudents: 10,
  tags: [],
  _count: {
    students: 5,
    requesters: 3,
  },
  createdById: trainerUser.id,
  createdBy: trainerUser,
  image: '',
  slackChannelId: '',
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
  post: (...args: any[]) => mockFetch(...args),
  update: (...args: any[]) => mockFetch(...args),
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      replace: jest.fn(),
    };
  },
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('CourseModal component', () => {
  it('renders toggle button for viewing enrolled students if user is an admin', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: adminUser,
      },
      status: 'authenticated',
    });
    renderWithTheme(
      <CourseModal
        course={upComingCourse}
        usersEnrolledCourseIds={[]}
        enrolledStudents={[]}
        requesters={[]}
        lang="en"
      />
    );
    const trainerTools = screen.getByTestId('trainer-tools');
    expect(trainerTools).toBeInTheDocument;
  });

  it('renders toggle button for viewing enrolled students if user is a trainer', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: trainerUser,
      },
      status: 'authenticated',
    });
    renderWithTheme(
      <CourseModal
        course={upComingCourse}
        usersEnrolledCourseIds={[]}
        enrolledStudents={[]}
        requesters={[]}
        lang="en"
      />
    );
    const trainerTools = screen.getByTestId('trainer-tools');
    expect(trainerTools).toBeInTheDocument;
  });

  it('does not render button for viewing enrolled students if user is a trainee', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: traineeUser,
      },
      status: 'authenticated',
    });
    renderWithTheme(
      <CourseModal
        course={upComingCourse}
        usersEnrolledCourseIds={[]}
        enrolledStudents={[]}
        requesters={[]}
        lang="en"
      />
    );
    const trainerTools = screen.queryByTestId('trainer-tools');
    expect(trainerTools).not.toBeInTheDocument;
  });
  it('changes the view to students when the toggle button is clicked', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: trainerUser,
      },
      status: 'authenticated',
    });
    renderWithTheme(
      <CourseModal
        course={upComingCourse}
        usersEnrolledCourseIds={[]}
        enrolledStudents={[{ name: traineeUser.name, userId: traineeUser.id }]}
        requesters={[]}
        lang="en"
      />
    );

    const studentsButton = screen.getByTestId('toggle-attendees-list');
    userEvent.click(studentsButton);
    await waitFor(() => {
      expect(screen.getByText(traineeUser.name)).toBeInTheDocument();
    });
  });
  it('changes the view to requests when the toggle button is clicked', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: adminUser,
      },
      status: 'authenticated',
    });
    renderWithTheme(
      <CourseModal
        course={pastCourse}
        usersEnrolledCourseIds={[]}
        enrolledStudents={[{ name: traineeUser.name, userId: traineeUser.id }]}
        requesters={[{ name: trainerUser.name, userId: trainerUser.id }]}
        lang="en"
      />
    );

    const requestsButton = screen.getByTestId('toggle-requests-list');
    userEvent.click(requestsButton);
    await waitFor(() => {
      expect(screen.getByText(trainerUser.name)).toBeInTheDocument();
    });
  });
});
