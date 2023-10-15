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

describe('Tag form: adding a new tag', () => {
  it('displays the correct error message when an empty tag is submitted', async () => {
    renderWithTheme(<TagForm />);
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitButton);

    expect(screen.getByText('A tag name is required')).toBeVisible();
  });

  it('displays the correct error message when a too long tag is submitted', async () => {
    renderWithTheme(<TagForm />);
    const inputField = screen.getByRole('textbox');

    await userEvent.type(
      inputField,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    );

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitButton);
    expect(
      screen.getByText('The maximum length for a tag is 50 characters')
    ).toBeVisible();
  });

  it('displays the correct error message when a tag with extra spaces is submitted', async () => {
    renderWithTheme(<TagForm />);
    const inputField = screen.getByRole('textbox');

    await userEvent.type(inputField, 'Robot  Framework');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await userEvent.click(submitButton);
    expect(
      screen.getByText('Consecutive spaces are not allowed')
    ).toBeVisible();
  });

  it('correct values are submitted from the tag form', async () => {
    renderWithTheme(<TagForm />);
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
    renderWithTheme(<TagForm />);
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
