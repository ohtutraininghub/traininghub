import { screen } from '@testing-library/react';
import CancelEnroll from './CancelEnroll';
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
  useRouter() {
    return {
      refresh: jest.fn(),
    };
  },
}));

const mockFetch = jest.fn((...args: any[]) =>
  Promise.resolve({
    json: () => Promise.resolve({ args: args }),
    ok: true,
  })
);

jest.mock('../../lib/response/fetchUtil', () => ({
  update: (...args: any[]) => mockFetch(...args),
}));

const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

describe('CancelEnroll component', () => {
  it('renders cancel button if cancelling is still allowed', () => {
    renderWithTheme(
      <CancelEnroll courseId="12345" lastCancelDate={tomorrow} lang="en" />
    );

    const cancelButton = screen.queryByRole('button', {
      name: /cancel enrollment/i,
    });
    expect(cancelButton).toBeInTheDocument;
  });

  it('renders no cancellation button if it is past the cancellation deadline', () => {
    renderWithTheme(
      <CancelEnroll courseId="12345" lastCancelDate={yesterday} lang="en" />
    );

    const cancelButton = screen.queryByRole('button', {
      name: /cancel enrollment/i,
    });
    expect(cancelButton).not.toBeInTheDocument;

    expect(
      screen.findByText(
        'The course starts soon. Contact the trainer if you want to cancel your enrollment.'
      )
    ).toBeVisible;
  });
});
