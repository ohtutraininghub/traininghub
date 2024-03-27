import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithTheme } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';
import CountryForm from '.';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
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

const mockFetch = jest.fn((...args: any[]) =>
  Promise.resolve({
    json: () => Promise.resolve({ args: args }),
    ok: true,
  })
);

jest.mock('../../lib/response/fetchUtil', () => ({
  post: (...args: any[]) => mockFetch(...args),
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

describe('Country form: adding a new country', () => {
  it('correct values are submitted from the country form', async () => {
    renderWithTheme(<CountryForm lang="en" />);
    const inputField = screen.getByLabelText('CountryForm.chooseCountry');

    const countryName = 'Argentina';
    await userEvent.type(inputField, countryName);

    const countryOption = screen.getByText('Argentina (AR)');
    await userEvent.click(countryOption);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/country', {
        name: countryName,
        countryCode: 'AR',
      });
    });
  });
});
