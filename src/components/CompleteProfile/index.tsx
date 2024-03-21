'use client';

import {
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Country, Title } from '@prisma/client';
import { useState } from 'react';

interface Props {
  countries: Country[];
  titles: Title[];
}

export default function CompleteProfile({ countries, titles }: Props) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');

  const handleValueChange = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === 'countrySelect') {
      setSelectedCountry(value);
    } else if (name === 'titleSelect') {
      setSelectedTitle(value);
    }
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', height: '100vh', alignItems: 'center' }}
    >
      <Box
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          backgroundColor: 'surface.main',
          boxShadow: 8,
        }}
      >
        <Typography variant="h2" color="secondary" textAlign="center" mb={4}>
          Complete your profile
        </Typography>
        <Typography
          variant="h6"
          color="secondary"
          textAlign="center"
          mb={2}
          sx={{ color: 'secondary' }}
        >
          Please fill in the following information to complete your profile
        </Typography>
        <form
          id="completeProfileForm"
          data-testid="completeProfileForm"
          onSubmit={submitForm}
        >
          <Container>
            <InputLabel
              htmlFor="countrySelect"
              id="country-label"
              sx={{ color: 'secondary' }}
            >
              Country
            </InputLabel>
            <Select
              name="countrySelect"
              id="countrySelect"
              labelId="country-label"
              style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}
              color="secondary"
              value={selectedCountry}
              onChange={handleValueChange}
              sx={{ color: 'secondary' }}
              MenuProps={{ disableScrollLock: true }}
            >
              {countries.map((country) => (
                <MenuItem
                  key={country.id}
                  value={country.name}
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
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </Container>
          <Container>
            <InputLabel
              htmlFor="titleSelect"
              id="title-label"
              sx={{ color: 'secondary' }}
            >
              Title
            </InputLabel>
            <Select
              name="titleSelect"
              id="titleSelect"
              labelId="title-label"
              style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}
              color="secondary"
              value={selectedTitle}
              onChange={handleValueChange}
              sx={{ color: 'secondary' }}
              MenuProps={{ disableScrollLock: true }}
            >
              {titles.map((title) => (
                <MenuItem
                  key={title.id}
                  value={title.name}
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
                  {title.name}
                </MenuItem>
              ))}
            </Select>
          </Container>
          <Container
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '2rem',
            }}
          >
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              sx={{
                color: 'white.main',
                '&.Mui-disabled': {
                  color: 'white.main',
                },
                backgroundColor: 'secondary.main',
                '&:hover': {
                  backgroundColor: 'secondary.light',
                },
              }}
            >
              Save Details
            </Button>
          </Container>
        </form>
      </Box>
    </Container>
  );
}
