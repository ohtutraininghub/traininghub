import React from 'react';
import { screen } from '@testing-library/react';
import SpeedDialMenu from '.';
import '@testing-library/jest-dom';
import { renderWithTheme } from '@/lib/test-utils';
import { Role } from '@prisma/client';
jest.mock('next-auth/react');
import { useSession } from 'next-auth/react';

const mockUseSession = useSession as jest.Mock;

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe('SpeedDial Menu', () => {
  it('renders SpeedDialMenu and all actions with admin user', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          role: Role.ADMIN,
        },
      },
    });
    renderWithTheme(<SpeedDialMenu />);

    const speedDial = screen.getByRole('button', { name: /SpeedDial menu/i });
    expect(speedDial).toBeInTheDocument();

    const dashboard = screen.getByTestId('dashboard');
    expect(dashboard).toBeInTheDocument();

    const newCourse = screen.getByTestId('new-course');
    expect(newCourse).toBeInTheDocument();
  });
  it('renders SpeedDialMenu and new course action with trainer user', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          role: Role.TRAINER,
        },
      },
    });
    renderWithTheme(<SpeedDialMenu />);

    const speedDial = screen.getByRole('button', { name: /SpeedDial menu/i });
    expect(speedDial).toBeInTheDocument();

    const dashboard = screen.queryByTestId('dashboard');
    expect(dashboard).toBeNull();

    const newCourse = screen.getByTestId('new-course');
    expect(newCourse).toBeInTheDocument();
  });
});
