import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import ProfileMenu from '.';
import type { ProfileMenuProps } from '.';
import '@testing-library/jest-dom';
import { renderWithTheme } from '@/lib/test-utils';

const testUser: ProfileMenuProps = {
  name: 'Test User',
  image: 'someimage.jpg',
};

const menuItems = ['viewProfileMenuItem', 'signOutMenuItem'];

describe('ProfileMenu component', () => {
  it('is rendered', () => {
    const { container } = renderWithTheme(<ProfileMenu {...testUser} />);
    expect(container).toBeInTheDocument();
  });

  it('opens a menu when the avatar is clicked', () => {
    renderWithTheme(<ProfileMenu {...testUser} />);
    const avatarButton = screen.getByTestId('avatarIconButton');
    fireEvent.click(avatarButton);
    expect(avatarButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows menu items after opened', () => {
    renderWithTheme(<ProfileMenu {...testUser} />);
    const avatarButton = screen.getByTestId('avatarIconButton');
    menuItems.forEach((menuItem) => {
      expect(screen.queryByTestId(menuItem)).not.toBeInTheDocument();
    });
    fireEvent.click(avatarButton);
    menuItems.forEach((menuItem) => {
      expect(screen.getByTestId(menuItem)).toBeVisible();
    });
  });
});
