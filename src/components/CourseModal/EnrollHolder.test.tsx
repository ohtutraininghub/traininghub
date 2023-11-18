import { screen } from '@testing-library/react';
import EnrollHolder from './EnrollHolder';
import { renderWithTheme } from '@/lib/test-utils';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      refresh: jest.fn(),
    };
  },
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

const mockFetch = jest.fn((...args: any[]) =>
  Promise.resolve({
    json: () => Promise.resolve({ args: args }),
    ok: true,
  })
);

jest.mock('../../lib/response/fetchUtil', () => ({
  post: (...args: any[]) => mockFetch(...args),
  update: (...args: any[]) => mockFetch(...args),
}));

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

describe('EnrollHolder component', () => {
  it('renders enroll button if user is not signed up and enrolling is possible', () => {
    renderWithTheme(
      <EnrollHolder
        isUserEnrolled={false}
        courseId="123"
        isCourseFull={false}
        startDate={new Date()}
        lastEnrollDate={null}
        lang="en"
      />
    );

    const enrollButton = screen.getByRole('button', { name: /enroll/i });
    expect(enrollButton).toBeInTheDocument;
  });

  it('displays info text but no enroll button if user is already signed up for the course', () => {
    renderWithTheme(
      <EnrollHolder
        isUserEnrolled={true}
        courseId="123"
        isCourseFull={false}
        startDate={new Date()}
        lastEnrollDate={null}
        lang="en"
      />
    );

    expect(screen.findByText('You have enrolled for this course!')).toBeVisible;

    const enrollButton = screen.queryByRole('button', { name: /enroll/i });
    expect(enrollButton).not.toBeInTheDocument;
  });

  it('does not render an enroll button if course is full', () => {
    renderWithTheme(
      <EnrollHolder
        isUserEnrolled={false}
        courseId="123"
        isCourseFull={true}
        startDate={new Date()}
        lastEnrollDate={null}
        lang="en"
      />
    );

    const enrollButton = screen.queryByRole('button', { name: /enroll/i });
    expect(enrollButton).not.toBeInTheDocument;
  });

  it('does not render an enroll button if deadline for enrolling is in the past', () => {
    renderWithTheme(
      <EnrollHolder
        isUserEnrolled={false}
        courseId="123"
        isCourseFull={false}
        startDate={new Date()}
        lastEnrollDate={yesterday}
        lang="en"
      />
    );

    const enrollButton = screen.queryByRole('button', { name: /enroll/i });
    expect(enrollButton).not.toBeInTheDocument;

    expect(screen.findByText('Enrollment has ended')).toBeVisible;
  });
});
