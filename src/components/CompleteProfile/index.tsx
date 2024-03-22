'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Country, Title } from '@prisma/client';
import SelectDropdown from '../SelectDropdown';
import { useTranslation } from '@i18n/client';
import { DictProps } from '@i18n/index';

interface Props extends DictProps {
  countries: Country[];
  titles: Title[];
}

export default function CompleteProfile({ countries, titles, lang }: Props) {
  const { t } = useTranslation(lang, 'components');
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
          {t('CompleteProfile.title')}
        </Typography>
        <Typography
          variant="h6"
          color="secondary"
          textAlign="center"
          mb={2}
          sx={{ color: 'secondary' }}
        >
          {t('CompleteProfile.subtitle')}
        </Typography>
        <form
          id="completeProfileForm"
          data-testid="completeProfileForm"
          onSubmit={submitForm}
        >
          <Container>
            <SelectDropdown
              name="country"
              label="Country"
              value={selectedCountry}
              handler={handleValueChange}
              items={countries}
            />
          </Container>
          <Container>
            <SelectDropdown
              name="title"
              label="Title"
              value={selectedTitle}
              handler={handleValueChange}
              items={titles}
            />
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
              {t('CompleteProfile.button')}
            </Button>
          </Container>
        </form>
      </Box>
    </Container>
  );
}
