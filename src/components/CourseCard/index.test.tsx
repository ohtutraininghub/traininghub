import { renderWithTheme } from '@/lib/test-utils';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import { screen } from '@testing-library/react';
import CourseCard from '.';

const course: CourseWithTagsAndStudentCount = {
  id: '22',
  name: 'Test course',
  description: 'A Test course',
  startDate: new Date(),
  endDate: new Date(),
  maxStudents: 42,
  _count: {
    students: 0,
  },
  tags: [],
};

beforeEach(() => {
  renderWithTheme(<CourseCard lang="en" course={course} />);
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
