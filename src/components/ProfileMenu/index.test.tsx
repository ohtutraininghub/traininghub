import React from 'react';
import { screen } from '@testing-library/react';
import ProfileMenu from '.';
import type { ProfileMenuProps } from '.';
import '@testing-library/jest-dom';
import { renderWithTheme } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';

const testUser: ProfileMenuProps = {
  lang: 'en',
};

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

jest.mock('next-auth/react', () => ({
  useSession: () => {
    return {
      data: {
        user: {
          name: 'Test User',
          image: 'someimage.jpg',
        },
      },
    };
  },
}));

const menuItems = ['homeMenuItem', 'viewProfileMenuItem', 'signOutMenuItem'];

describe('ProfileMenu component', () => {
  it('avatar button is rendered', () => {
    renderWithTheme(<ProfileMenu {...testUser} />);
    const avatarButton = screen.getByTestId('avatarIconButton');
    expect(avatarButton).toBeInTheDocument();
  });

  it('opens a menu when the avatar is clicked', async () => {
    renderWithTheme(<ProfileMenu {...testUser} />);
    const avatarButton = screen.getByTestId('avatarIconButton');
    await userEvent.click(avatarButton);
    expect(avatarButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows menu items after opened', async () => {
    renderWithTheme(<ProfileMenu {...testUser} />);
    const avatarButton = screen.getByTestId('avatarIconButton');
    menuItems.forEach((menuItem) => {
      expect(screen.queryByTestId(menuItem)).not.toBeInTheDocument();
    });
    await userEvent.click(avatarButton);
    menuItems.forEach((menuItem) => {
      expect(screen.getByTestId(menuItem)).toBeVisible();
    });
  });
});
