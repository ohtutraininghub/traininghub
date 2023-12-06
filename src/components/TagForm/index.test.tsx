import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithTheme } from '@/lib/test-utils';
import TagForm from '.';
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

describe('Tag form: adding a new tag', () => {
  it('correct values are submitted from the tag form', async () => {
    renderWithTheme(<TagForm lang="en" />);
    const inputField = screen.getByRole('textbox');

    const tagName = 'Jenkins';
    await userEvent.type(inputField, tagName);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/tag', {
        name: tagName,
      });
    });
  });

  it('any leading and trailing spaces are trimmed from the submitted tag', async () => {
    renderWithTheme(<TagForm lang="en" />);
    const inputField = screen.getByRole('textbox');

    const tagName = ' Python ';
    await userEvent.type(inputField, tagName);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toBeCalledWith('/api/tag', {
        name: tagName.trim(),
      });
    });
  });
});
