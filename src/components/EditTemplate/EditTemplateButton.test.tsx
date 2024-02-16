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
    renderWithTheme(
      <EditTemplateButton
        templateId="1"
        lang="en"
        onClick={function (): void {}}
      />
    );
    const buttonElement = screen.getByTestId('EditTemplateButton');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('EditTemplate.button.edit');
  });

  test('calls the onClick function when clicked', () => {
    const onClick = jest.fn();
    renderWithTheme(
      <EditTemplateButton templateId="1" lang="en" onClick={onClick} />
    );
    const buttonElement = screen.getByTestId('EditTemplateButton');
    fireEvent.click(buttonElement);
    expect(onClick).toHaveBeenCalled();
  });
});
