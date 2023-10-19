import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/lib/test-utils';
import CourseForm from './CourseForm';
import { dateToDateTimeLocal } from '@/lib/timedateutils';

window.alert = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      refresh: jest.fn(),
    };
  },
}));

jest.mock('../Providers/MessageProvider', () => ({
  useMessage() {
    return {
      notify: jest.fn(),
    };
  },
}));

var mockFetch = jest.fn((...args: any[]) =>
  Promise.resolve({
    json: () => Promise.resolve({ args: args }),
    ok: true,
  })
);

jest.mock('../../lib/response/fetchUtil', () => ({
  post: (...args: any[]) => mockFetch(...args),
  update: (...args: any[]) => mockFetch(...args),
}));

const requiredErrors = [
  'Name is required',
  'Description is required',
  'Start date is required',
  'End date is required',
  'Max students is required',
];

describe('Course Form New Course Tests', () => {
  beforeEach(() => {
    renderWithTheme(<CourseForm lang="en" tags={[]} />);
  });

  it('Required errors for form fields are displayed correctly', async () => {
    // Clear the max students input because it has a default value
    const maxStudents = screen.getByTestId('courseFormMaxStudents');
    await userEvent.clear(maxStudents);

    const submitButton = screen.getByTestId('courseFormSubmit');
    await userEvent.click(submitButton);

    requiredErrors.forEach((message) => {
      expect(screen.getByText(message)).toBeVisible();
    });
  });

  it('Form is submitted with correct values', async () => {
    const inputValues = {
      name: 'New course',
      description: 'A test course',
      startDate: '2053-09-13T16:43',
      endDate: '2053-10-13T18:50',
      maxStudents: '55',
      tags: [],
    };

    const name = screen.getByTestId('courseFormName');
    const description = screen.getByTestId('courseFormDescription');
    const startDate = screen.getByTestId('courseFormStartDate');
    const endDate = screen.getByTestId('courseFormEndDate');
    const maxStudents = screen.getByTestId('courseFormMaxStudents');
    const submitButton = screen.getByTestId('courseFormSubmit');

    await userEvent.type(name, inputValues.name);
    await userEvent.type(description, inputValues.description);

    fireEvent.change(startDate, { target: { value: inputValues.startDate } });
    fireEvent.change(endDate, { target: { value: inputValues.endDate } });

    await userEvent.clear(maxStudents);
    await userEvent.type(maxStudents, inputValues.maxStudents);

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/course', {
        ...inputValues,
        endDate: new Date(inputValues.endDate),
        maxStudents: Number(inputValues.maxStudents),
        startDate: new Date(inputValues.startDate),
      });
    });
  });
});

describe('Course Form Course Edit Tests', () => {
  it('Form is filled with course values in Edit Mode', async () => {
    const course = {
      id: '1234',
      name: 'New course',
      description: 'A test course',
      startDate: new Date(),
      endDate: new Date(),
      maxStudents: 55,
      tags: [],
    };
    renderWithTheme(<CourseForm lang="en" tags={[]} courseData={course} />);

    const name = screen
      .getByTestId('courseFormName')
      .querySelector('input') as HTMLInputElement;
    const description = screen.getByTestId(
      'courseFormDescription'
    ) as HTMLInputElement;
    const startDate = screen.getByTestId(
      'courseFormStartDate'
    ) as HTMLInputElement;
    const endDate = screen.getByTestId('courseFormEndDate') as HTMLInputElement;
    const maxStudents = screen.getByTestId(
      'courseFormMaxStudents'
    ) as HTMLInputElement;

    expect(name.value).toBe(course.name);
    expect(description.value).toBe(course.description);
    expect(maxStudents.value).toBe(course.maxStudents.toString());
    expect(startDate.value).toBe(dateToDateTimeLocal(course.startDate));
    expect(endDate.value).toBe(dateToDateTimeLocal(course.endDate));
  });

  it('Form is submitted with correct values in Edit Mode', async () => {
    const course = {
      id: '1234',
      name: 'New course',
      description: 'A test course',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      maxStudents: 55,
      tags: [],
    };

    renderWithTheme(<CourseForm lang="en" tags={[]} courseData={course} />);

    const submitButton = screen.getByTestId('courseFormSubmit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/course', {
        ...course,
        endDate: new Date(course.endDate),
        maxStudents: Number(course.maxStudents),
        startDate: new Date(course.startDate),
      });
    });
  });
});
