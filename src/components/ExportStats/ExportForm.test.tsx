import React from 'react';
import '@testing-library/jest-dom';
import ExportForm from '.';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/lib/test-utils';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

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

describe('ExportStats', () => {
  it('should render ExportStats', async () => {
    renderWithTheme(<ExportForm lang="en" />);
  });

  it('should render form label for from date', async () => {
    renderWithTheme(<ExportForm lang="en" />);
    expect(screen.getByText('ExportStats.fromDate')).toBeInTheDocument();
  });
  it('should render form input field for from date', async () => {
    renderWithTheme(<ExportForm lang="en" />);
    expect(screen.getByTestId('exportFormFromDate')).toBeInTheDocument();
  });

  it('should render form label for to date', async () => {
    renderWithTheme(<ExportForm lang="en" />);
    expect(screen.getByText('ExportStats.toDate')).toBeInTheDocument();
  });
  it('should render form input field for to date', async () => {
    renderWithTheme(<ExportForm lang="en" />);
    expect(screen.getByTestId('exportFormToDate')).toBeInTheDocument();
  });

  it('should render export button', async () => {
    renderWithTheme(<ExportForm lang="en" />);
    expect(screen.getByText('ExportStats.button')).toBeInTheDocument();
  });
});
