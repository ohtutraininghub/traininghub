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

  it('Form is submitted with correct values when no last enroll or cancel dates are given', async () => {
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
        lastEnrollDate: null,
        lastCancelDate: null,
      });
    });
  });

  it('Form is submitted with correct values when last enroll date is given', async () => {
    const inputValues = {
      name: 'New course',
      description: 'A test course',
      startDate: '2053-09-13T09:30',
      endDate: '2053-10-13T17:30',
      lastEnrollDate: '2053-09-06T23:59',
      maxStudents: '12',
      tags: [],
    };

    const name = screen.getByTestId('courseFormName');
    const description = screen.getByTestId('courseFormDescription');
    const startDate = screen.getByTestId('courseFormStartDate');
    const endDate = screen.getByTestId('courseFormEndDate');
    const lastEnrollDate = screen.getByTestId('courseFormLastEnrollDate');
    const maxStudents = screen.getByTestId('courseFormMaxStudents');
    const submitButton = screen.getByTestId('courseFormSubmit');

    await userEvent.type(name, inputValues.name);
    await userEvent.type(description, inputValues.description);

    fireEvent.change(startDate, { target: { value: inputValues.startDate } });
    fireEvent.change(endDate, { target: { value: inputValues.endDate } });
    fireEvent.change(lastEnrollDate, {
      target: { value: inputValues.lastEnrollDate },
    });

    await userEvent.clear(maxStudents);
    await userEvent.type(maxStudents, inputValues.maxStudents);

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/course', {
        ...inputValues,
        endDate: new Date(inputValues.endDate),
        maxStudents: Number(inputValues.maxStudents),
        startDate: new Date(inputValues.startDate),
        lastEnrollDate: new Date(inputValues.lastEnrollDate),
        lastCancelDate: null,
      });
    });
  });

  it('Form is submitted with correct values when last cancel date is given', async () => {
    const inputValues = {
      name: 'New course',
      description: 'A test course',
      startDate: '2053-09-13T09:30',
      endDate: '2053-10-13T17:30',
      lastCancelDate: '2053-09-13T09:30',
      maxStudents: '12',
      tags: [],
    };

    const name = screen.getByTestId('courseFormName');
    const description = screen.getByTestId('courseFormDescription');
    const startDate = screen.getByTestId('courseFormStartDate');
    const endDate = screen.getByTestId('courseFormEndDate');
    const lastCancelDate = screen.getByTestId('courseFormLastCancelDate');
    const maxStudents = screen.getByTestId('courseFormMaxStudents');
    const submitButton = screen.getByTestId('courseFormSubmit');

    await userEvent.type(name, inputValues.name);
    await userEvent.type(description, inputValues.description);

    fireEvent.change(startDate, { target: { value: inputValues.startDate } });
    fireEvent.change(endDate, { target: { value: inputValues.endDate } });
    fireEvent.change(lastCancelDate, {
      target: { value: inputValues.lastCancelDate },
    });

    await userEvent.clear(maxStudents);
    await userEvent.type(maxStudents, inputValues.maxStudents);

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/course', {
        ...inputValues,
        endDate: new Date(inputValues.endDate),
        maxStudents: Number(inputValues.maxStudents),
        startDate: new Date(inputValues.startDate),
        lastEnrollDate: null,
        lastCancelDate: new Date(inputValues.lastCancelDate),
      });
    });
  });
});

describe('Course Form Course Edit Tests', () => {
  const courseStart = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const courseEnd = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const oneDayBeforeStart = new Date();

  it('Form is filled with course values in Edit Mode', async () => {
    const course = {
      id: '1234',
      createdById: '30',
      name: 'New course',
      description: 'A test course',
      startDate: courseStart,
      endDate: courseEnd,
      lastEnrollDate: oneDayBeforeStart,
      lastCancelDate: oneDayBeforeStart,
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
    const lastEnrollDate = screen.getByTestId(
      'courseFormLastEnrollDate'
    ) as HTMLInputElement;
    const lastCancelDate = screen.getByTestId(
      'courseFormLastCancelDate'
    ) as HTMLInputElement;
    const maxStudents = screen.getByTestId(
      'courseFormMaxStudents'
    ) as HTMLInputElement;

    expect(name.value).toBe(course.name);
    expect(description.value).toBe(course.description);
    expect(maxStudents.value).toBe(course.maxStudents.toString());
    expect(startDate.value).toBe(dateToDateTimeLocal(course.startDate));
    expect(endDate.value).toBe(dateToDateTimeLocal(course.endDate));
    expect(lastEnrollDate.value).toBe(
      dateToDateTimeLocal(course.lastEnrollDate)
    );
    expect(lastCancelDate.value).toBe(
      dateToDateTimeLocal(course.lastCancelDate)
    );
  });

  it('Form is filled with course values in Edit Mode when last enroll and last cancel dates are null', async () => {
    const course = {
      id: '1234',
      createdById: '30',
      name: 'New course',
      description: 'A test course',
      startDate: new Date(),
      endDate: new Date(),
      lastEnrollDate: null,
      lastCancelDate: null,
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
    const lastEnrollDate = screen.getByTestId(
      'courseFormLastEnrollDate'
    ) as HTMLInputElement;
    const lastCancelDate = screen.getByTestId(
      'courseFormLastCancelDate'
    ) as HTMLInputElement;
    const maxStudents = screen.getByTestId(
      'courseFormMaxStudents'
    ) as HTMLInputElement;

    expect(name.value).toBe(course.name);
    expect(description.value).toBe(course.description);
    expect(maxStudents.value).toBe(course.maxStudents.toString());
    expect(startDate.value).toBe(dateToDateTimeLocal(course.startDate));
    expect(endDate.value).toBe(dateToDateTimeLocal(course.endDate));
    expect(lastEnrollDate.value).toBe('');
    expect(lastCancelDate.value).toBe('');
  });

  it('Form is submitted with correct values in Edit Mode', async () => {
    const course = {
      id: '1234',
      createdById: '30',
      name: 'New course',
      description: 'A test course',
      startDate: courseStart,
      endDate: courseEnd,
      lastEnrollDate: oneDayBeforeStart,
      lastCancelDate: oneDayBeforeStart,
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
        lastEnrollDate: new Date(course.lastEnrollDate),
        lastCancelDate: new Date(course.lastCancelDate),
      });
    });
  });

  it('Form is submitted with correct values in Edit Mode when last enroll and last cancel dates are null', async () => {
    const course = {
      id: '1234',
      createdById: '30',
      name: 'New course',
      description: 'A test course',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      lastEnrollDate: null,
      lastCancelDate: null,
      maxStudents: 55,
      tags: [],
    };

    renderWithTheme(<CourseForm lang="en" tags={[]} courseData={course} />);

    const submitButton = screen.getByTestId('courseFormSubmit');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/course', {
        ...course,
        startDate: new Date(course.startDate),
        endDate: new Date(course.endDate),
        lastEnrollDate: null,
        lastCancelDate: null,
        maxStudents: Number(course.maxStudents),
      });
    });
  });
});
