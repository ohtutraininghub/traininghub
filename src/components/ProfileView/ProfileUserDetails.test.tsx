import React from 'react';
import ProfileUserDetails from './ProfileUserDetails';
import type { ProfileUserDetailProps } from './ProfileUserDetails';
import { renderWithTheme } from '@/lib/test-utils';
import { screen } from '@testing-library/react';

const testUser: ProfileUserDetailProps = {
  name: 'Test User',
  email: 'testmail@testingworldxyz.com',
  image: 'someimage.jpg',
  country: 'Test Country',
  title: 'Test Title',
};

describe('Profile User Details component', () => {
  it('renders user information correctly', () => {
    renderWithTheme(<ProfileUserDetails {...testUser} />);
    expect(screen.getByText(testUser.name)).toBeVisible();
    expect(screen.getByText(testUser.email)).toBeVisible();
    expect(screen.getByAltText(testUser.name)).toBeInTheDocument();
    expect(screen.getByText(testUser.country)).toBeVisible();
    expect(screen.getByText(testUser.title)).toBeVisible();
  });
});
