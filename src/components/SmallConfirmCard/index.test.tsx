import { renderWithTheme } from '@/lib/test-utils';
import { screen } from '@testing-library/react';
import { SmallConfirmCard } from '.';

describe('Small confirm card', () => {
  it('renders both icon buttons', () => {
    renderWithTheme(
      <SmallConfirmCard
        confirmTooltip="confirm"
        cancelTooltip="cancel"
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    const confirmButton = screen.getByTestId('confirm-button');
    const cancelButton = screen.getByTestId('cancel-button');
    expect(confirmButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });
  it('allows buttons to be clicked', () => {
    const handleSubmit = jest.fn();
    const handleCancel = jest.fn();
    renderWithTheme(
      <SmallConfirmCard
        confirmTooltip="confirm"
        cancelTooltip="cancel"
        onSubmit={() => handleSubmit()}
        onCancel={() => handleCancel()}
      />
    );

    const confirmButton = screen.getByTestId('confirm-button');
    const cancelButton = screen.getByTestId('cancel-button');
    confirmButton.click();
    cancelButton.click();

    expect(handleSubmit).toHaveBeenCalled();
    expect(handleCancel).toHaveBeenCalled();
  });
});
