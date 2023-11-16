import React from 'react';
import { screen } from '@testing-library/react';
import SpeedDialMenu from '.';
import '@testing-library/jest-dom';
import { renderWithTheme } from '@/lib/test-utils';
import { Role } from '@prisma/client';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

jest.mock('next-auth/react', () => ({
  useSession() {
    return {
      data: {
        user: {
          role: Role.ADMIN,
        },
      },
    };
  },
}));

describe('SpeedDial Menu', () => {
  it('renders SpeedDialMenu and all actions', () => {
    renderWithTheme(<SpeedDialMenu />);

    const speedDial = screen.getByRole('button', { name: /SpeedDial menu/i });
    expect(speedDial).toBeInTheDocument();

    const newTag = screen.getByTestId('dashboard');
    expect(newTag).toBeInTheDocument();

    const newCourse = screen.getByTestId('new-course');
    expect(newCourse).toBeInTheDocument();
  });
});
