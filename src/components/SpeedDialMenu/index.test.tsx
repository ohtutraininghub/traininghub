import React from 'react';
import { screen } from '@testing-library/react';
import SpeedDialMenu from '.';
import '@testing-library/jest-dom';
import { renderWithTheme } from '@/lib/test-utils';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe('SpeedDialMenu', () => {
  it('renders SpeedDialMenu and all actions', () => {
    renderWithTheme(<SpeedDialMenu />);

    const speedDial = screen.getByRole('button', { name: /SpeedDial menu/i });
    expect(speedDial).toBeInTheDocument();

    const newTag = screen.getByTestId('add-tag');
    expect(newTag).toBeInTheDocument();

    const newCourse = screen.getByTestId('new-course');
    expect(newCourse).toBeInTheDocument();
  });
});
