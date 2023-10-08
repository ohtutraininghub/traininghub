'use client';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonIcon from '@mui/icons-material/Person';
import Logout from '@mui/icons-material/Logout';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { ConfirmCard } from '../ConfirmCard';
import { signOut } from 'next-auth/react';
import { useTheme } from '@mui/material/styles';

export interface ProfileMenuProps {
  name: string;
  image: string;
}

export default function ProfileMenu({ name, image }: ProfileMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const { palette } = useTheme();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <ConfirmCard
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={'Confirm sign out?'}
        handleClick={() => signOut()}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          paddingRight: '20px',
        }}
      >
        <Tooltip title="User profile">
          <IconButton
            data-testid="avatarIconButton"
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              src={image}
              alt={name}
              style={{
                width: '32px',
                height: '32px',
                boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.2)',
                border: '1px solid white',
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        data-testid="accountMenu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link href="/profile" style={{ textDecoration: 'none' }}>
          <MenuItem
            data-testid="viewProfileMenuItem"
            style={{ color: palette.black.main }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            View profile
          </MenuItem>
        </Link>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <LocalOfferIcon fontSize="small" />
          </ListItemIcon>
          Tags
        </MenuItem>
        <Divider />
        <MenuItem
          data-testid="signOutMenuItem"
          onClick={() => {
            setBackdropOpen(true);
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
