import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { TemplateSearchBar } from './TemplateSearchBar';
import { renderWithTheme } from '@/lib/test-utils';

jest.mock('../../lib/i18n/client', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));
describe('TemplateSearchBar', () => {
  const mockOnSearchTermChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the search bar with the correct label', () => {
    renderWithTheme(
      <TemplateSearchBar
        onSearchTermChange={mockOnSearchTermChange}
        lang="en"
      />
    );
    expect(
      screen.getAllByText('TemplateSearchBar.Label.text')[0]
    ).toBeInTheDocument();
  });

  test('calls onSearchTermChange with the input value on text change', () => {
    renderWithTheme(
      <TemplateSearchBar
        onSearchTermChange={mockOnSearchTermChange}
        lang="en"
      />
    );
    const inputElement = screen
      .getByTestId('TemplateSearchBar')
      .querySelector('input');
    fireEvent.change(inputElement, { target: { value: 'new search term' } });
    expect(mockOnSearchTermChange).toHaveBeenCalledWith('new search term');
  });
});
