import { Users } from '@/lib/prisma/users';
import { renderWithTheme } from '@/lib/test-utils';
import '@testing-library/jest-dom';
import { screen, within } from '@testing-library/react';
import UserList from '.';
import userEvent from '@testing-library/user-event';

const date = new Date();

const users: Users = [
  {
    id: '1a',
    name: 'Tester',
    email: 'tester@traininghub.org',
    emailVerified: date,
    image: null,
    role: 'ADMIN',
  },
  {
    id: '2a',
    name: 'Trainer',
    email: 'trainer@traininghub.org',
    emailVerified: date,
    image: null,
    role: 'TRAINER',
  },
  {
    id: '3a',
    name: 'Trainee',
    email: 'trainee@traininghub.org',
    emailVerified: date,
    image: null,
    role: 'TRAINEE',
  },
];

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      refresh: jest.fn(),
    };
  },
}));

jest.mock('../Providers/MessageProvider', () => ({
  useMessage() {
    return {
      notify: jest.fn(),
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

jest.mock('../../lib/response/errorUtil', () => ({
  handleCommonErrors: (...args: any[]) => mockFetch(...args),
}));

jest.mock('../../lib/response/responseUtil', () => ({
  MessageType: {},
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

describe('User list', () => {
  beforeEach(() => {
    renderWithTheme(<UserList lang="en" users={users} />);
  });
  it('renders all columns', () => {
    const nameColumn = screen.getByText('EditUsers.tableHeaders.name');
    const emailColumn = screen.getByText('EditUsers.tableHeaders.email');
    const verifiedColumn = screen.getByText(
      'EditUsers.tableHeaders.emailVerified'
    );
    const roleColumn = screen.getByText('EditUsers.tableHeaders.role');

    expect(nameColumn).toBeInTheDocument();
    expect(emailColumn).toBeInTheDocument();
    expect(verifiedColumn).toBeInTheDocument();
    expect(roleColumn).toBeInTheDocument();
  });

  it('displays all users', () => {
    const tester = screen.getByText('Tester');
    const trainer = screen.getByText('Trainer');
    const trainee = screen.getByText('Trainee');

    expect(tester).toBeInTheDocument();
    expect(trainer).toBeInTheDocument();
    expect(trainee).toBeInTheDocument();
  });

  it('allows user role dropdown to be clicked', async () => {
    const dropdown = within(
      await screen.findByTestId('1a-role-select')
    ).getByRole('combobox');

    await userEvent.click(dropdown);

    expect(
      await screen.findByRole('option', { name: 'admin' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('option', { name: 'trainee' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('option', { name: 'trainer' })
    ).toBeInTheDocument();
  });

  it('small confirm card is displayed when role new role is selected', async () => {
    const dropdown = within(
      await screen.findByTestId('1a-role-select')
    ).getByRole('combobox');

    await userEvent.click(dropdown);
    const traineeOption = await screen.findByRole('option', {
      name: 'trainee',
    });
    await userEvent.click(traineeOption);

    const smallConfirmCard = await screen.findByTestId('small-confirm-card');
    expect(smallConfirmCard).toBeInTheDocument();
  });
});
