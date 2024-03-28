import React from 'react';
import '@testing-library/jest-dom';
import CompleteProfile from '.';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('../../lib/response/fetchUtil', () => ({
  update: (...args: any[]) => mockFetch(...args),
}));

jest.mock('../../lib/i18n/client', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

jest.mock('../../lib/response/responseUtil', () => ({
  MessageType: {},
}));

var mockFetch = jest.fn((...args: any[]) =>
  Promise.resolve({
    json: () => Promise.resolve({ args: args }),
    message: 'Profile updated',
    messageType: 'success',
    ok: true,
  })
);

describe('CompleteProfile', () => {
  const countries = [
    { id: '1', name: 'Finland', countryCode: 'FI' },
    { id: '2', name: 'Sweden', countryCode: 'SE' },
  ];

  const titles = [
    { id: '1', name: 'Employee' },
    { id: '2', name: 'Team lead' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should submit form with valid data', async () => {
    render(<CompleteProfile countries={countries} titles={titles} lang="en" />);
    await userEvent.click(
      screen.getByRole('combobox', { name: 'CompleteProfile.countryLabel' })
    );
    await userEvent.click(screen.getByText(countries[0].name));
    await userEvent.click(
      screen.getByRole('combobox', { name: 'CompleteProfile.titleLabel' })
    );
    await userEvent.click(screen.getByText(titles[0].name));
    await userEvent.click(
      screen.getByRole('button', { name: 'CompleteProfile.button' })
    );
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/profile', {
        country: '1',
        title: '1',
      });
    });
  });

  it('should not submit form with empty data', async () => {
    render(<CompleteProfile countries={countries} titles={titles} lang="en" />);
    await userEvent.click(
      screen.getByRole('button', { name: 'CompleteProfile.button' })
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should not submit form with invalid data', async () => {
    render(<CompleteProfile countries={countries} titles={titles} lang="en" />);
    await userEvent.click(
      screen.getByRole('combobox', { name: 'CompleteProfile.countryLabel' })
    );
    await userEvent.click(screen.getByText(countries[0].name));
    await userEvent.click(
      screen.getByRole('button', { name: 'CompleteProfile.button' })
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
