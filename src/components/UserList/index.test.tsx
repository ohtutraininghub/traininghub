import { Users } from '@/lib/prisma/users';
import { renderWithTheme } from '@/lib/test-utils';
import '@testing-library/jest-dom';
import { screen, within } from '@testing-library/react';
import UserList from '.';
import userEvent from '@testing-library/user-event';
import { Country, Title } from '@prisma/client';

const date = new Date();

const users: Users = [
  {
    id: '1a',
    name: 'Tester',
    email: 'tester@traininghub.org',
    emailVerified: date,
    image: null,
    role: 'ADMIN',
    countryId: '1',
    titleId: '1',
    profileCompleted: true,
  },
  {
    id: '2a',
    name: 'Trainer',
    email: 'trainer@traininghub.org',
    emailVerified: date,
    image: null,
    role: 'TRAINER',
    countryId: '2',
    titleId: '2',
    profileCompleted: true,
  },
  {
    id: '3a',
    name: 'Trainee',
    email: 'trainee@traininghub.org',
    emailVerified: date,
    image: null,
    role: 'TRAINEE',
    countryId: '1',
    titleId: '1',
    profileCompleted: true,
  },
];

const countries: Country[] = [
  {
    id: '1',
    name: 'Country 1',
    countryCode: 'C1',
  },
  {
    id: '2',
    name: 'Country 2',
    countryCode: 'C2',
  },
];

const titles: Title[] = [
  {
    id: '1',
    name: 'Title 1',
  },
  {
    id: '2',
    name: 'Title 2',
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
    renderWithTheme(
      <UserList lang="en" users={users} countries={countries} titles={titles} />
    );
    mockFetch.mockClear();
  });
  it('renders all columns', () => {
    const nameColumn = screen.getByText('EditUsers.tableHeaders.name');
    const emailColumn = screen.getByText('EditUsers.tableHeaders.email');
    const roleColumn = screen.getByText('EditUsers.tableHeaders.role');

    expect(nameColumn).toBeInTheDocument();
    expect(emailColumn).toBeInTheDocument();
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

  it('allows user country dropdown to be clicked', async () => {
    const dropdown = within(
      await screen.findByTestId('1a-country-select')
    ).getByRole('combobox');

    await userEvent.click(dropdown);

    expect(
      await screen.findByRole('option', { name: 'Country 1' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('option', { name: 'Country 2' })
    ).toBeInTheDocument();
  });

  it('allows user title dropdown to be clicked', async () => {
    const dropdown = within(
      await screen.findByTestId('1a-title-select')
    ).getByRole('combobox');

    await userEvent.click(dropdown);

    expect(
      await screen.findByRole('option', { name: 'Title 1' })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('option', { name: 'Title 2' })
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

  it('pressing confirm button after changing country calls fetch update', async () => {
    const dropdown = within(
      await screen.findByTestId('1a-country-select')
    ).getByRole('combobox');

    await userEvent.click(dropdown);
    const countryOption = await screen.findByRole('option', {
      name: 'Country 2',
    });
    await userEvent.click(countryOption);

    const smallConfirmCard = await screen.findByTestId('small-confirm-card');
    expect(smallConfirmCard).toBeInTheDocument();

    const confirmButton = await screen.findByTestId('confirm-button');
    await userEvent.click(confirmButton);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('pressing confirm button after changing title calls fetch update', async () => {
    const dropdown = within(
      await screen.findByTestId('1a-title-select')
    ).getByRole('combobox');

    await userEvent.click(dropdown);
    const titleOption = await screen.findByRole('option', {
      name: 'Title 2',
    });
    await userEvent.click(titleOption);

    const smallConfirmCard = await screen.findByTestId('small-confirm-card');
    expect(smallConfirmCard).toBeInTheDocument();

    const confirmButton = await screen.findByTestId('confirm-button');
    await userEvent.click(confirmButton);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('renders user links with correct href values', async () => {
    const testerlink = screen.getByTestId(`${users[0].id}-user-link`);
    expect(testerlink).toBeInTheDocument();
    expect(testerlink).toHaveAttribute('href', `/profile/${users[0].id}`);

    const trainerlink = screen.getByTestId(`${users[1].id}-user-link`);
    expect(trainerlink).toBeInTheDocument();
    expect(trainerlink).toHaveAttribute('href', `/profile/${users[1].id}`);

    const traineelink = screen.getByTestId(`${users[2].id}-user-link`);
    expect(traineelink).toBeInTheDocument();
    expect(traineelink).toHaveAttribute('href', `/profile/${users[2].id}`);
  });
});
