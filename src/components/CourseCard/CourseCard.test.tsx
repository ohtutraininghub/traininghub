import { renderWithTheme } from '@/lib/test-utils';
import CourseCard from './CourseCard';
import { Course } from '@prisma/client';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const course: Course = {
  id: '22',
  name: 'Test course',
  description: 'A Test course',
  startDate: new Date(),
  endDate: new Date(),
  maxStudents: 42,
};

beforeEach(() => {
  renderWithTheme(<CourseCard lang="en" course={course} />);
});

describe('CourseCard tests', () => {
  it('Course data should be displayed correctly', async () => {
    expect(screen.getByText(course.name)).toBeVisible();
    expect(screen.getByText(course.startDate.toDateString())).toBeVisible();
    expect(
      screen.getByText(`0 / ${course.maxStudents}`, { exact: false })
    ).toBeVisible();
    expect(screen.getByText(course.description)).not.toBeVisible();
  });

  it('Course description should be visible when collapse is opened', async () => {
    const toggle = screen.getByRole('button');
    await userEvent.click(toggle);
    expect(screen.getByText(course.description)).toBeVisible();
  });
});
