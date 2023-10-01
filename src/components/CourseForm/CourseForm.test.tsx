import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/lib/test-utils';
import CourseForm from './CourseForm';

window.alert = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      refresh: jest.fn(),
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

beforeEach(() => {
  renderWithTheme(<CourseForm />);
});

describe('Course Form Tests', () => {
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
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
      })
    );

    global.fetch = mockFetch as jest.Mock;

    const inputValues = {
      name: 'New course',
      description: 'A test course',
      startDate: '2053-09-13T16:43',
      endDate: '2053-10-13T18:50',
      maxStudents: '55',
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
        body: JSON.stringify({
          ...inputValues,
          startDate: new Date(inputValues.startDate),
          endDate: new Date(inputValues.endDate),
          maxStudents: Number(inputValues.maxStudents),
        }),
        method: 'POST',
      });
    });
  });
});
