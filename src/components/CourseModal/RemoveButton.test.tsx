import { screen, fireEvent } from '@testing-library/react';
import RemoveButton from './RemoveButton';
import { renderWithTheme } from '@/lib/test-utils';
import CourseModal from '.';
import { Role, User } from '@prisma/client';
import { CourseWithInfo } from '@/lib/prisma/courses';
import { useSession } from 'next-auth/react';

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

describe('RemoveButton', () => {
  it('renders the button with the correct text', () => {
    renderWithTheme(<RemoveButton handleDelete={() => {}} lang="en" />);

    const buttonElement = screen.getByTestId('removeCourseButton');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Remove');
  });

  test('opens the confirm card when the button is clicked', () => {
    renderWithTheme(<RemoveButton handleDelete={() => {}} lang="en" />);
    const buttonElement = screen.getByTestId('removeCourseButton');
    fireEvent.click(buttonElement);
    const confirmCardElement = screen.getByTestId('confirmCard');
    expect(confirmCardElement).toBeInTheDocument();
  });

  test('calls the handleDelete function when confirmed', () => {
    const handleDeleteMock = jest.fn();
    renderWithTheme(<RemoveButton handleDelete={handleDeleteMock} lang="en" />);
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    const confirmButtonElement = screen.getByTestId('confirmCardConfirm');

    fireEvent.click(confirmButtonElement);
    expect(handleDeleteMock).toHaveBeenCalledTimes(1);
  });
});
