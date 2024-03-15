import { renderWithTheme } from '@/lib/test-utils';
import CreateSlackButton from './CreateSlackButton';
import { waitFor } from '@testing-library/react';

describe('CreateSlackButton ', () => {
  it('renders the text and image of the button', async () => {
    const render = renderWithTheme(
      <CreateSlackButton lang="en" onclick={jest.fn()} buttonDisabled={false} />
    );
    const buttonByText = render.findByDisplayValue('slack');
    const buttonByImage = await waitFor(() => {
      render.getByAltText('Slack image');
    });
    expect(buttonByText).toBeInTheDocument;
    expect(buttonByImage).toBeInTheDocument;
  });

  it('calls the onClick function when the button is clicked', async () => {
    const mockOnClick = jest.fn();
    const render = renderWithTheme(
      <CreateSlackButton
        lang="en"
        onclick={mockOnClick}
        buttonDisabled={false}
      />
    );
    const button = render.getByTestId('createSlackButton');
    button.click();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when buttonDisabled is true', async () => {
    const mockOnClick = jest.fn();
    const render = renderWithTheme(
      <CreateSlackButton
        lang="en"
        onclick={mockOnClick}
        buttonDisabled={true}
      />
    );
    const button = render.getByTestId('createSlackButton');
    button.click();
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
