import {
  render,
  screen,
  fireEvent,
  renderHook,
  waitFor,
} from '@testing-library/react';
import { DeleteTemplateButton } from './DeleteTemplateButton';
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

describe('DeleteTemplateButton', () => {
  test('renders the button with the correct text', () => {
    renderWithTheme(<DeleteTemplateButton templateId="1" lang="en" />);
    const buttonElement = screen.getByTestId('DeleteTemplateButton');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent(
      'DeleteTemplateButton.button.delete'
    );
  });

  test('opens the popup when the button is clicked', () => {
    renderWithTheme(<DeleteTemplateButton templateId="1" lang="en" />);
    const buttonElement = screen.getByTestId('DeleteTemplateButton');
    fireEvent.click(buttonElement);
    const confirmPopupElement = screen.getByTestId('confirmCard');
    expect(confirmPopupElement).toBeInTheDocument();
  });

  test('calls the removal function when the button is pressed', async () => {
    const { remove } = require('../../lib/response/fetchUtil');
    renderWithTheme(<DeleteTemplateButton templateId="1" lang="en" />);
    const deleteButton = screen.getByTestId('DeleteTemplateButton');
    fireEvent.click(deleteButton);
    const confirmButtonElement = screen.getByTestId('confirmCardConfirm');
    fireEvent.click(confirmButtonElement);

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith('/api/template', { templateId: '1' });
    });
  });
});
