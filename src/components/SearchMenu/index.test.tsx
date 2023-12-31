import React from 'react';
import { screen } from '@testing-library/react';
import SearchMenu from '.';
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

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

describe('SearchMenu Component', () => {
  it('renders a button to open search menu', () => {
    renderWithTheme(
      <SearchMenu initialCourses={[]} initialTags={[]} lang="en" />
    );

    expect(screen.getByText('button.openSearchDrawer')).toBeInTheDocument();
  });

  it('the search drawer contents is not immediately rendered', async () => {
    renderWithTheme(
      <SearchMenu initialCourses={[]} initialTags={[]} lang="en" />
    );

    expect(screen.queryByText('menuTitle')).not.toBeInTheDocument();
  });
});
