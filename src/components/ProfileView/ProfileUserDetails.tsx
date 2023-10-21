'use client';

import { Avatar, Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';

export interface ProfileUserDetailProps {
  name: string;
  email: string;
  image: string;
}

export default function ProfileUserDetails({
  name,
  email,
  image,
}: ProfileUserDetailProps) {
  const { palette } = useTheme();

  const gradientBackground = `linear-gradient(-50deg, ${palette.secondary.main}, ${palette.secondary.light})`;

  return (
    <Paper
      elevation={3}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        background: gradientBackground,
      }}
    >
      <Avatar
        src={image}
        alt={name}
        style={{
          width: '100px',
          height: '100px',
          boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.3)',
          marginBottom: '8px',
          border: '2px solid white',
        }}
      />
      <Typography
        variant="h5"
        gutterBottom
        style={{ color: palette.white.main }}
      >
        {name}
      </Typography>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <EmailIcon fontSize="small" style={{ color: palette.white.main }} />
        <Typography
          variant="overline"
          style={{ marginLeft: '8px', color: palette.white.main }}
        >
          {email}
        </Typography>
      </Box>
    </Paper>
  );
}
