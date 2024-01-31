import { render, screen, fireEvent } from '@testing-library/react';
import RemoveButton from './RemoveButton';

describe('RemoveButton', () => {
  test('renders the button with the correct text', () => {
    render(<RemoveButton handleDelete={() => {}} lang="en" />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('Remove Course');
  });

  test('opens the confirm card when the button is clicked', () => {
    render(<RemoveButton handleDelete={() => {}} lang="en" />);
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    const confirmCardElement = screen.getByTestId('confirm-card');
    expect(confirmCardElement).toBeInTheDocument();
  });

  test('calls the handleDelete function when confirmed', () => {
    const handleDeleteMock = jest.fn();
    render(<RemoveButton handleDelete={handleDeleteMock} lang="en" />);
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    const confirmButtonElement = screen.getByRole('button', {
      name: 'Confirm',
    });
    fireEvent.click(confirmButtonElement);
    expect(handleDeleteMock).toHaveBeenCalledTimes(1);
  });
});
