import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/lib/test-utils';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import CourseFilter from './CourseFilter';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/'),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    set: jest.fn(),
  }),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

const initialCourses: CourseWithTagsAndStudentCount[] = [
  {
    id: '1',
    name: 'Python fundamentals',
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
  renderWithTheme(
    <CourseFilter initialCourses={initialCourses} initialTags={initialTags} />
  );
});

describe('Coursefilter', () => {
  it('filters with a name', async () => {
    const courseName = screen.getByTestId('search-autocomplete');
    await userEvent.type(courseName, 'Python');
    const option = screen.getByText('Python fundamentals');
    await userEvent.click(option);
    expect(screen.queryByText('No options')).toBeNull();
    await userEvent.type(courseName, 'pyr');
    expect(screen.getByText('No options'));
  });

  it('filters with a tag', async () => {
    expect(screen.getByText('Python')).toBeInTheDocument();
    const button = screen.getByText('Python');
    await userEvent.click(button);
    expect(screen.getByText('Python fundamentals')).toBeInTheDocument();
  });
});
