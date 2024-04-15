import React from 'react';
import '@testing-library/jest-dom';
import ExportStats from '.';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/lib/test-utils';
import ExportForm from './ExportForm';

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

describe('ExportForm', () => {
  it('should render ExportForm', async () => {
    renderWithTheme(<ExportStats lang="en" />);
  });

  it('should render ExportStats header', async () => {
    renderWithTheme(<ExportStats lang="en" />);
    expect(screen.getByText('ExportStats.header')).toBeInTheDocument();
  });
});
