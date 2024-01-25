import CourseModal from '.';
import { renderWithTheme } from '@/lib/test-utils';
import { Role, User } from '@prisma/client';
import { CourseWithCreatedByInfo } from '@/lib/prisma/courses';
import { screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

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

const traineeUser: User = {
  id: '123c',
  name: 'Taylor Trainee',
  email: 'taylor@traininghub.org',
  emailVerified: null,
  image: '',
  role: Role.TRAINEE,
};

const testCourse: CourseWithCreatedByInfo = {
  id: '987654cba',
  name: 'Robot Framework Fundamentals',
  description:
    'This course will teach you how to automate the acceptance testing of your software using Robot Framework, a generic, open-source, Python-based automation framework. You will get an introduction to how Robot Framework works and learn how to write tasks utilising keywords, all in an easily readable and human-friendly syntax.',
  startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  lastEnrollDate: null,
  lastCancelDate: null,
  maxStudents: 10,
  tags: [],
  _count: { students: 5 },
  createdById: adminUser.id,
  createdBy: adminUser,
  image: '',
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
        course={testCourse}
        usersEnrolledCourseIds={[]}
        enrolledStudents={[]}
        enrolls="0/10"
        editCourseLabel="Edit course"
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
        course={testCourse}
        usersEnrolledCourseIds={[]}
        enrolledStudents={[]}
        enrolls="0/10"
        editCourseLabel="Edit course"
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
        course={testCourse}
        usersEnrolledCourseIds={[]}
        enrolledStudents={[]}
        enrolls="0/10"
        editCourseLabel="Edit course"
        lang="en"
      />
    );
    const trainerTools = screen.queryByTestId('trainer-tools');
    expect(trainerTools).not.toBeInTheDocument;
  });
});
