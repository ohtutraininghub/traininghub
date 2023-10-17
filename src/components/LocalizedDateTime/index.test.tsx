import { screen } from '@testing-library/react';
import LocalizedDateTime from '.';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import { renderWithTheme } from '@/lib/test-utils';

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

describe('LocalizedDateTime', () => {
  it('shows date in a verbose way', () => {
    renderWithTheme(
      <LocalizedDateTime
        variant="range-short"
        startDate={course.startDate}
        endDate={course.endDate}
      />
    );
    const expectedString = `${course.startDate.toDateString()} - ${course.endDate.toDateString()}`;
    expect(screen.getByText(expectedString)).toBeVisible();
  });
});
