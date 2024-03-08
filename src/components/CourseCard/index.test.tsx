import { renderWithTheme } from '@/lib/test-utils';
import { CourseWithInfo } from '@/lib/prisma/courses';
import { screen } from '@testing-library/react';
import CourseCard from '.';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(() => new URLSearchParams()),
  usePathname: jest.fn(() => '/'),
}));

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

const currentDate = new Date().setHours(9, 0, 0, 0).valueOf();
const msDay = 24 * 60 * 60 * 1000;

const upComingCourse: CourseWithInfo = {
  id: '22',
  name: 'Test course',
  description: 'A Test course',
  startDate: new Date(currentDate + msDay),
  endDate: new Date(currentDate + 2 * msDay),
  lastEnrollDate: null,
  lastCancelDate: null,
  createdBy: {
    name: 'Test User',
  },
  createdById: '123456789',
  maxStudents: 42,
  _count: {
    students: 0,
    requesters: 0,
  },
  tags: [],
  image: '',
  summary: 'After this course you will know all about testing with Jest!',
};

const pastCourse: CourseWithInfo = {
  id: '23',
  name: 'Second test course',
  description: 'The second test course',
  startDate: new Date(currentDate - 3 * msDay),
  endDate: new Date(currentDate - msDay),
  lastEnrollDate: null,
  lastCancelDate: null,
  createdBy: {
    name: 'Test User',
  },
  createdById: '123456789',
  maxStudents: 13,
  _count: {
    students: 0,
    requesters: 10,
  },
  tags: [],
  image: '',
  summary: 'Test course for testing purposes!',
};

describe('CourseCard tests', () => {
  it('Course data should be displayed correctly for upcoming course', async () => {
    renderWithTheme(
      <CourseCard
        lang="en"
        studentCount={`0 / ${upComingCourse.maxStudents}`}
        course={upComingCourse}
      />
    );

    expect(screen.getByText(upComingCourse.name)).toBeVisible();
    expect(screen.getByText(`0 / ${upComingCourse.maxStudents}`)).toBeVisible();
    expect(
      screen.queryByText(upComingCourse.description)
    ).not.toBeInTheDocument();
    expect(screen.getByText(upComingCourse.summary as string)).toBeVisible();
  });
  it('Course data should be displayed correctly for past course', async () => {
    renderWithTheme(
      <CourseCard
        lang="en"
        studentCount={`${pastCourse._count.requesters}`}
        course={pastCourse}
      />
    );

    expect(screen.getByText('CourseCard.expired')).toBeVisible();
    expect(screen.getByText(pastCourse.name)).toBeVisible();
    expect(screen.getByText(`${pastCourse._count.requesters}`)).toBeVisible();
    expect(screen.queryByText(pastCourse.description)).not.toBeInTheDocument();
    expect(screen.getByText(pastCourse.summary as string)).toBeVisible();
  });
});
