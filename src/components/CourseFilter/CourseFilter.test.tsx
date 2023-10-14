import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/lib/test-utils';
import MockedCourseFilter from './MockedCourseFilter';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';

const initialCourses: CourseWithTagsAndStudentCount[] = [
  {
    id: '1',
    name: 'Python',
    description: 'Python fundamentals',
    startDate: new Date('2023-10-27T00:00:00Z'),
    endDate: new Date('2023-11-28T00:00:00Z'),
    maxStudents: 20,
    tags: [
      { id: '9', name: 'Testing' },
      { id: '7', name: 'Python' },
      { id: '8', name: 'Robot Framework' },
    ],
    _count: { students: 0 },
  },
  {
    id: '2',
    name: 'JavaScript',
    description: 'JavaScript basics',
    startDate: new Date('2023-11-10T00:00:00Z'),
    endDate: new Date('2023-12-12T00:00:00Z'),
    maxStudents: 25,
    tags: [
      { id: '2', name: 'CI/CD' },
      { id: '5', name: 'Jenkins' },
    ],
    _count: { students: 0 },
  },
  {
    id: '3',
    name: 'React',
    description: 'React framework',
    startDate: new Date('2023-11-15T00:00:00Z'),
    endDate: new Date('2023-12-18T00:00:00Z'),
    maxStudents: 18,
    tags: [{ id: '7', name: 'Python' }],
    _count: { students: 0 },
  },
  {
    id: '4',
    name: 'Node.js',
    description: 'Node.js basics',
    startDate: new Date('2023-12-01T00:00:00Z'),
    endDate: new Date('2023-12-04T00:00:00Z'),
    maxStudents: 22,
    tags: [
      { id: '6', name: 'Kubernetes' },
      { id: '3', name: 'Docker' },
      { id: '2', name: 'CI/CD' },
    ],
    _count: { students: 0 },
  },
];

type Tag = {
  id: string;
  name: string;
};

const initialTags: Tag[] = [
  { id: '1', name: 'Agile methods' },
  { id: '2', name: 'CI/CD' },
  { id: '3', name: 'Docker' },
  { id: '4', name: 'Git' },
  { id: '5', name: 'Jenkins' },
  { id: '6', name: 'Kubernetes' },
  { id: '7', name: 'Python' },
  { id: '8', name: 'Robot Framework' },
  { id: '9', name: 'Testing' },
];

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  renderWithTheme(
    <MockedCourseFilter
      initialCourses={initialCourses}
      initialTags={initialTags}
    />
  );
});

describe('Coursefilter', () => {
  it('filters with a name', async () => {
    const courseName = screen.getByTestId('search-paper');
    await userEvent.type(courseName, 'rea');
    expect(screen.getByText('React framework')).toBeInTheDocument();
    await userEvent.type(courseName, 'dddd');
    expect(screen.getByText('No courses found')).toBeInTheDocument();
  });

  it('filters with a tag', async () => {
    const tagSelect = screen.getByTestId('tag-select');
    await userEvent.click(tagSelect);
    expect(screen.getByText('Python')).toBeInTheDocument();
    const select = 'Python';
    const option = screen.getByText(select);
    await userEvent.click(option);
    expect(screen.getByText('Python fundamentals')).toBeInTheDocument();
  });

  it('filters with a date', async () => {
    const startDate = screen.getByLabelText('Start Date');
    const testStartDate = new Date('2023-11-20T00:00:00Z');
    fireEvent.change(startDate, { target: { value: testStartDate } });
    const endDate = screen.getByLabelText('End Date');
    const testEndDate = new Date('2023-12-18T00:00:00Z');
    fireEvent.change(endDate, { target: { value: testEndDate } });
    expect(screen.getByText('React framework')).toBeInTheDocument();
  });
});
