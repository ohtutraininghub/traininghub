import { renderWithTheme } from '@/lib/test-utils';
import CourseCard from '.';
import { Course } from '@prisma/client';
import { screen } from '@testing-library/react';

const course: Course = {
  id: '22',
  name: 'Test course',
  description: 'A Test course',
  startDate: new Date(),
  endDate: new Date(),
  maxStudents: 42,
};

beforeEach(() => {
  renderWithTheme(<CourseCard course={course} />);
});

describe('CourseCard tests', () => {
  it('Course data should be displayed correctly', async () => {
    expect(screen.getByText(course.name)).toBeVisible();
    expect(screen.getByText(course.startDate.toDateString())).toBeVisible();
    expect(
      screen.getByText(`0 / ${course.maxStudents}`, { exact: false })
    ).toBeVisible();
    expect(screen.queryByText(course.description)).not.toBeInTheDocument();
  });
});
