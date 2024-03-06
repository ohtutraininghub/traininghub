import { CourseWithInfo } from '@/lib/prisma/courses';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '@/lib/test-utils';
import CourseList from '.';
import { useSession } from 'next-auth/react';
import { User, Role } from '@prisma/client';

jest.mock('../../lib/i18n/client', () => ({
  useTranslation: () => ({
    t: jest.fn((key) => {
      const translations = {
        'ToggleTrainingsButton.currentTrainings': 'Current trainings',
        'ToggleTrainingsButton.requestTrainings': 'Request trainings',
      };
      return translations[key] || key;
    }),
  }),
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
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('CourseList Component', () => {
  const adminUser: User = {
    id: '123a',
    name: 'Ada Admin',
    email: 'admin@traininghub.org',
    emailVerified: null,
    image: '',
    role: Role.ADMIN,
  };

  const courses: CourseWithInfo[] = [
    {
      _count: {
        students: 10,
        requesters: 5,
      },
      createdBy: {
        name: '',
      },
      summary: '',
      id: '1',
      name: 'Introduction to Python',
      description: 'Learn Python programming.',
      startDate: new Date('2030-01-01'), // Future course to be shown when current trainings are displayed
      endDate: new Date('2030-01-31'),
      lastEnrollDate: null,
      lastCancelDate: null,
      createdById: '1234321',
      maxStudents: 20,
      tags: [{ id: 'tag1', name: 'Programming' }],
      image: '',
    },
    {
      _count: {
        students: 5,
        requesters: 0,
      },
      createdBy: {
        name: '',
      },
      summary: '',
      id: '2',
      name: 'Web Development Bootcamp',
      description: 'Become a full-stack developer.',
      startDate: new Date('2029-11-12'), // Future course to be shown when current trainings are displayed
      endDate: new Date('2029-11-28'),
      lastEnrollDate: null,
      lastCancelDate: null,
      createdById: '123432132',
      maxStudents: 15,
      tags: [{ id: 'tag2', name: 'Web Development' }],
      image: '',
    },
    {
      _count: {
        students: 10,
        requesters: 1,
      },
      createdBy: {
        name: '',
      },
      summary: '',
      id: '3',
      name: 'Jenkins Fundamentals',
      description: 'Learn Jenkins programming.',
      startDate: new Date('2022-11-12'),
      endDate: new Date('2022-11-28'), // Old course to be shown when request trainings button is clicked
      lastEnrollDate: null,
      lastCancelDate: null,
      createdById: '123432132',
      maxStudents: 15,
      tags: [],
      image: '',
    },
  ];

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: adminUser,
      },
      status: 'authenticated',
    });

    renderWithTheme(
      <CourseList
        lang="en"
        courses={courses}
        openedCourse={undefined}
        usersEnrolledCourseIds={[]}
        enrolledStudents={null}
        searchCourses={{}}
      />
    );
  });

  it('renders CourseCard component in grid view', () => {
    fireEvent.click(screen.getByLabelText('grid view'));
    expect(screen.getByTestId('grid-view')).toBeInTheDocument();
  });

  it('renders ListItems in list view', () => {
    fireEvent.click(screen.getByLabelText('list view'));
    expect(screen.getByTestId('list-view')).toBeInTheDocument();
  });

  it('toggles past courses on request trainings button click', async () => {
    fireEvent.click(screen.getByTestId('toggle-past-trainings-button'));
    expect(await screen.findByText(courses[2].name)).toBeInTheDocument();
    expect(screen.queryByText(courses[0].name)).not.toBeInTheDocument();
    expect(screen.queryByText(courses[1].name)).not.toBeInTheDocument();
  });

  it('shows current courses button when past courses are displayed', async () => {
    const button = screen.getByTestId('toggle-past-trainings-button');
    fireEvent.click(button);
    expect(button).toHaveTextContent('Current trainings');
  });

  it('shows request trainings button when current courses are displayed', async () => {
    const button = screen.getByTestId('toggle-past-trainings-button');
    expect(button).toHaveTextContent('Request trainings');
  });
});
