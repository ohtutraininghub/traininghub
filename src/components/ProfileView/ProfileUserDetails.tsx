'use client';

import { Avatar, Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';

export interface ProfileUserDetailProps {
  name: string;
  email: string;
  image: string;
  country: string;
  title: string;
}

export default function ProfileUserDetails({
  name,
  email,
  image,
  country,
  title,
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
        imgProps={{ referrerPolicy: 'no-referrer' }}
        style={{
          width: '100px',
          height: '100px',
          boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.3)',
          marginBottom: '8px',
          border: '2px solid white',
        }}
      />
      <Typography
        variant="h3"
        gutterBottom
        style={{ color: palette.white.main }}
      >
        {name}
      </Typography>
      <Typography variant="overline" style={{ color: palette.white.main }}>
        {title}
      </Typography>
      <Typography
        variant="overline"
        style={{ color: palette.white.main, padding: 0 }}
      >
        {country}
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
