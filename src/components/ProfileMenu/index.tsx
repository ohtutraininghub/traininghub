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
import HomeIcon from '@mui/icons-material/Home';
import React from 'react';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { ConfirmCard } from '@/components/ConfirmCard';
import { signOut } from 'next-auth/react';
import { useTheme } from '@mui/material/styles';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@i18n/client';

export interface ProfileMenuProps extends DictProps {
  name: string;
  image: string;
}

export default function ProfileMenu({ name, image, lang }: ProfileMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components', {
    keyPrefix: 'ProfileMenu',
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ConfirmCard
        lang={lang}
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={t('confirmSignOut')}
        handleClick={() => signOut()}
      />
      <Tooltip title={t('menuTooltip')}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            padding: { xs: '0 0.5em 0 0', sm: '0 1em 0 0' },
          }}
          onClick={handleClick}
        >
          <IconButton
            data-testid="avatarIconButton"
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Typography
              variant="body2"
              style={{
                marginRight: '25px',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: palette.white.main,
                fontSize: '20px',
              }}
            >
              {t('profileTitle')}
            </Typography>
            <Avatar
              src={image}
              alt={name}
              style={{
                width: '50px',
                height: '50px',
                boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.2)',
                border: '2px solid white',
                marginRight: '20px',
              }}
            />
          </IconButton>
        </Box>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        data-testid="accountMenu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        disableScrollLock={true}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <MenuItem
            data-testid="homeMenuItem"
            style={{ color: palette.black.main }}
          >
            <ListItemIcon>
              <HomeIcon fontSize="small" />
            </ListItemIcon>
            {t('home')}
          </MenuItem>
        </Link>
        <Link href="/profile" style={{ textDecoration: 'none' }}>
          <MenuItem
            data-testid="viewProfileMenuItem"
            style={{ color: palette.black.main }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            {t('viewProfile')}
          </MenuItem>
        </Link>
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
          {t('signOut')}
        </MenuItem>
      </Menu>
    </>
  );
}
