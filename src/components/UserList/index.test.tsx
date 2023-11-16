import { renderWithTheme } from '@/lib/test-utils';
//import { screen } from '@testing-library/react';
import UserList from '.';
import { Users } from '@/lib/prisma/users';

const users: Users = [
  {
    id: '1a',
    name: 'Tester',
    email: 'tester@traininghub.org',
    emailVerified: new Date(),
    image: null,
    role: 'ADMIN',
  },
  {
    id: '2a',
    name: 'Trainer',
    email: 'trainer@traininghub.org',
    emailVerified: new Date(),
    image: null,
    role: 'TRAINER',
  },
  {
    id: '3a',
    name: 'Trainee',
    email: 'trainee@traininghub.org',
    emailVerified: new Date(),
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

var mockFetch = jest.fn((...args: any[]) =>
  Promise.resolve({
    json: () => Promise.resolve({ args: args }),
    ok: true,
  })
);

jest.mock('../../lib/response/fetchUtil', () => ({
  update: (...args: any[]) => mockFetch(...args),
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
  it('renders all columns', () => {
    renderWithTheme(<UserList lang="en" users={users} />);
  });
});
