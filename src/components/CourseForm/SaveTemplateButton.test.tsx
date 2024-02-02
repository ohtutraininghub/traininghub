import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import SaveTemplateButton from './SaveTemplateButton';
import { renderWithTheme } from '@/lib/test-utils';

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

describe('SaveTemplateButton', () => {
  test('renders the button with the correct text', () => {
    renderWithTheme(
      <SaveTemplateButton
        handleDialogOpen={() => {}}
        handleSaveTemplate={() => {}}
        lang="en"
        isSubmitting={false}
        dialogOpen={false}
      />
    );
    const buttonElement = screen.getByTestId('saveTemplateButton');
    expect(buttonElement).toBeInTheDocument();
  });
});

test('opens the popup when the button is clicked', () => {
  renderWithTheme(
    <SaveTemplateButton
      handleDialogOpen={() => {}}
      handleSaveTemplate={() => {}}
      lang="en"
      isSubmitting={false}
      dialogOpen={false}
    />
  );
  const buttonElement = screen.getByTestId('saveTemplateButton');
  fireEvent.click(buttonElement);
  const confirmPopupElement = screen.getByTestId('confirmCard');
  expect(confirmPopupElement).toBeInTheDocument();
});

test('calls the handleSaveTemplate function when confirmed', () => {
  const handleSaveTemplateMock = jest.fn();
  renderWithTheme(
    <SaveTemplateButton
      handleDialogOpen={() => {}}
      handleSaveTemplate={handleSaveTemplateMock}
      lang="en"
      isSubmitting={false}
      dialogOpen={false}
    />
  );
  const buttonElement = screen.getByTestId('saveTemplateButton');
  fireEvent.click(buttonElement);
  const confirmButtonElement = screen.getByTestId('confirmCardConfirm');
  fireEvent.click(confirmButtonElement);
  expect(handleSaveTemplateMock).toHaveBeenCalledTimes(1);
});
