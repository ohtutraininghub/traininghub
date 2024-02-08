import {
  render,
  screen,
  fireEvent,
  renderHook,
  waitFor,
} from '@testing-library/react';
import { EditTemplateButton } from './EditTemplateButton';
import { renderWithTheme } from '@/lib/test-utils';

// Mocking translation and fetch utilities
jest.mock('../../lib/i18n/client', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

// Providing mock implementations for useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
}));

// Mocking the remove function
jest.mock('../../lib/response/fetchUtil', () => ({
  remove: jest.fn().mockResolvedValue({ status: 200 }),
}));

describe('EditTemplateButton', () => {
  test('renders the button with the correct text', () => {
    renderWithTheme(<EditTemplateButton templateId="1" lang="en" />);
    const buttonElement = screen.getByTestId('EditTemplateButton');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('EditTemplateButton.button.edit');
  });
});
