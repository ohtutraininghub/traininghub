import { renderWithTheme } from '@/lib/test-utils';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
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

const course: CourseWithTagsAndStudentCount = {
  id: '22',
  name: 'Test course',
  description: 'A Test course',
  startDate: new Date(),
  endDate: new Date(),
  createdById: '123456789',
  maxStudents: 42,
  _count: {
    students: 0,
  },
  tags: [],
};

beforeEach(() => {
  renderWithTheme(
    <CourseCard enrolls={`0 / ${course.maxStudents}`} course={course} />
  );
});

describe('CourseCard tests', () => {
  it('Course data should be displayed correctly', async () => {
    expect(screen.getByText(course.name)).toBeVisible();
    expect(
      screen.getByText(`0 / ${course.maxStudents}`, { exact: false })
    ).toBeVisible();
    expect(screen.queryByText(course.description)).not.toBeInTheDocument();
  });
});
