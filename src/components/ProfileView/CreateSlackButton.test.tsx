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
});
