import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithTheme } from '@/lib/test-utils';
import TitleForm from '.';
import userEvent from '@testing-library/user-event';

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

describe('Title form: adding a new title', () => {
  it('correct values are submitted from the title form', async () => {
    renderWithTheme(<TitleForm lang="en" />);
    const inputField = screen.getByRole('textbox');

    const titleName = 'Boss';
    await userEvent.type(inputField, titleName);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/title', {
        name: titleName,
      });
    });
  });

  it('trims any leading and trailing spaces from the submitted title', async () => {
    renderWithTheme(<TitleForm lang="en" />);
    const inputField = screen.getByRole('textbox');

    const titleName = ' Employee ';
    await userEvent.type(inputField, titleName);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/title', {
        name: titleName.trim(),
      });
    });
  });
});
