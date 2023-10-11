import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/lib/test-utils';
import CourseFilter from './CourseFilter';

type Course = {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  maxStudents: number;
  tags: string[];
};

const initialCourses: Course[] = [
  {
    id: '1',
    name: 'Python',
    description: 'Python fundamentals',
    startDate: new Date('2023-10-27T00:00:00Z'),
    endDate: new Date('2023-11-28T00:00:00Z'),
    maxStudents: 20,
    tags: ['Testing', 'Python', 'Robot Framework'],
  },
  {
    id: '2',
    name: 'JavaScript',
    description: 'JavaScript basics',
    startDate: new Date('2023-11-10T00:00:00Z'),
    endDate: new Date('2023-12-12T00:00:00Z'),
    maxStudents: 25,
    tags: ['CI/CD', 'Jenkins'],
  },
  {
    id: '3',
    name: 'React',
    description: 'React framework',
    startDate: new Date('2023-11-15T00:00:00Z'),
    endDate: new Date('2023-12-18T00:00:00Z'),
    maxStudents: 18,
    tags: ['Programming', 'Python'],
  },
  {
    id: '4',
    name: 'Node.js',
    description: 'Node.js basics',
    startDate: new Date('2023-12-01T00:00:00Z'),
    endDate: new Date('2023-12-04T00:00:00Z'),
    maxStudents: 22,
    tags: ['Kubernetes', 'Docker', 'CI/CD'],
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
  renderWithTheme(<CourseFilter courses={initialCourses} tags={initialTags} />);
});

describe('Coursefilter', () => {
  it('filters with a name', async () => {
    const courseName = screen.getByTestId('search-paper');
    await userEvent.type(courseName, 'rea');
    expect(screen.getByText('React framework'));
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
