'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Country, Title } from '@prisma/client';
import SelectDropdown from '../SelectDropdown';
import { useTranslation } from '@i18n/client';
import { DictProps } from '@i18n/index';
import { MessageType } from '@/lib/response/responseUtil';
import { useMessage } from '../Providers/MessageProvider';
import { update } from '@/lib/response/fetchUtil';
import { zodResolver } from '@hookform/resolvers/zod';
import { userInfoSchema, UserInfoSchemaType } from '@/lib/zod/user';
import { Controller, useForm } from 'react-hook-form';
import FormFieldError from '@/components/FormFieldError';

interface Props extends DictProps {
  countries: Country[];
  titles: Title[];
}

export default function CompleteProfile({ countries, titles, lang }: Props) {
  const { t } = useTranslation(lang, 'components');
  const router = useRouter();
  const { notify } = useMessage();

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<UserInfoSchemaType>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      country: '',
      title: '',
    },
  });

  const submitForm = async (data: UserInfoSchemaType) => {
    try {
      const responseJson = await update('/api/profile', data);
      notify(responseJson);
      reset();
      router.push('/');
    } catch (error) {
      notify({
        message: t('CompleteProfile.error'),
        messageType: MessageType.ERROR,
      });
    }
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
          onSubmit={handleSubmit(submitForm)}
        >
          <Box>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  field={field}
                  label={t('CompleteProfile.countryLabel')}
                  items={countries}
                />
              )}
            />
            <FormFieldError error={errors.country} />
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <SelectDropdown
                  field={field}
                  label={t('CompleteProfile.titleLabel')}
                  items={titles}
                />
              )}
            />
            <FormFieldError error={errors.title} />
          </Box>
          <Container
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '2rem',
            }}
          >
            <Button
              type="submit"
              disabled={isSubmitting}
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
