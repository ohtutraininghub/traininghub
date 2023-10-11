import React from 'react';
import { screen } from '@testing-library/react';
import ProfileMenu from '.';
import type { ProfileMenuProps } from '.';
import '@testing-library/jest-dom';
import { renderWithTheme } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';

const testUser: ProfileMenuProps = {
  name: 'Test User',
  image: 'someimage.jpg',
};

const menuItems = ['viewProfileMenuItem', 'signOutMenuItem'];

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
