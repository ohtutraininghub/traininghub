'use client';

import { Box, Container, MenuItem, Select, Typography } from '@mui/material';

export default function CompleteProfile() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          backgroundColor: 'coverBlue.main',
          boxShadow: 8,
        }}
      >
        <Typography
          variant="h2"
          color="secondary.contrastText"
          textAlign="center"
        >
          Complete your profile
        </Typography>
        <Container>
          <Select
            labelId="country"
            style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}
            color="secondary"
            value="country"
          >
            <MenuItem
              divider
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'surface.main',
                },
                '&.Mui-selected.Mui-focusVisible': {
                  backgroundColor: 'surface.dark',
                },
                '&:hover': {
                  backgroundColor: 'surface.light',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'surface.main',
                },
              }}
            >
              Finland
            </MenuItem>
          </Select>
        </Container>
        <Container>
          <Select
            labelId="title"
            style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}
            color="secondary"
            value="country"
          >
            <MenuItem
              divider
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'surface.main',
                },
                '&.Mui-selected.Mui-focusVisible': {
                  backgroundColor: 'surface.dark',
                },
                '&:hover': {
                  backgroundColor: 'surface.light',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'surface.main',
                },
              }}
            >
              Employee
            </MenuItem>
            <MenuItem>Team Lead</MenuItem>
            <MenuItem>Management</MenuItem>
          </Select>
        </Container>
      </Box>
    </Container>
  );
}
