import React from 'react';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/lib/test-utils';
import CourseForm from '.';
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
      summary: 'All you ever wanted to know about testing!',
      startDate: courseStart,
      endDate: courseEnd,
      lastEnrollDate: oneDayBeforeStart,
      lastCancelDate: oneDayBeforeStart,
      maxStudents: 55,
      tags: [],
      image: '',
    };
    const { container } = renderWithTheme(
      <CourseForm lang="en" tags={[]} courseData={course} />
    );

    const name = screen.getByTestId('courseFormName') as HTMLInputElement;
    const description = container.querySelector('.tiptap');
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
    const summary = screen.getByTestId('courseFormSummary') as HTMLInputElement;

    expect(name.value).toBe(course.name);
    expect(description).toHaveTextContent(course.description);
    expect(summary.value).toBe(course.summary);
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
      summary: 'All you ever wanted to know about testing!',
      startDate: new Date(),
      endDate: new Date(),
      lastEnrollDate: null,
      lastCancelDate: null,
      maxStudents: 55,
      tags: [],
      image: '',
    };
    const { container } = renderWithTheme(
      <CourseForm lang="en" tags={[]} courseData={course} />
    );

    const name = screen.getByTestId('courseFormName') as HTMLInputElement;
    const description = container.querySelector('.tiptap');
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
    const summary = screen.getByTestId('courseFormSummary') as HTMLInputElement;

    expect(name.value).toBe(course.name);
    expect(description).toHaveTextContent(course.description);
    expect(summary.value).toBe(course.summary);
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
      description: '<p>A test course</p>',
      summary: 'All you ever wanted to know about testing!',
      startDate: courseStart,
      endDate: courseEnd,
      lastEnrollDate: oneDayBeforeStart,
      lastCancelDate: oneDayBeforeStart,
      maxStudents: 55,
      tags: [],
      image: '',
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
      summary: 'All you ever wanted to know about testing!',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      lastEnrollDate: null,
      lastCancelDate: null,
      maxStudents: 55,
      tags: [],
      image: '',
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
