'use client';

import { Button } from '@mui/material';
import { useState } from 'react';
import { ConfirmCard } from '../ConfirmCard';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@i18n/client';

interface SignOutButtonProps extends DictProps {}

export function SignOutButton({ lang }: SignOutButtonProps) {
  const [backdropOpen, setBackdropOpen] = useState(false);
  const { t } = useTranslation(lang, 'components');
  return (
    <>
      <Button
        variant="text"
        sx={{ color: 'black.main', padding: '0.75em' }}
        onClick={() => {
          setBackdropOpen(true);
        }}
      >
        {t('SignOutButton.signOut')}
      </Button>
      <ConfirmCard
        lang={lang}
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={'Confirm sign out?'}
        handleClick={() => signOut()}
      />
    </>
  );
}

interface CourseModalCloseButtonProps extends DictProps {}

export function CourseModalCloseButton({ lang }: CourseModalCloseButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { t } = useTranslation(lang, 'components');

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('courseId');
    router.replace(`${pathname}?${params}`);
  };

  return (
    <Button onClick={handleClick} data-testid="course-modal-close-button">
      {t('CourseModalCloseButton.close')}
    </Button>
  );
}

export function ToggleTrainingsButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <Button
      sx={{
        fontSize: { xs: '0.8rem', md: '1rem' },
        paddingX: { xs: '0.8rem', sm: '1rem' },
        paddingY: { xs: '0.3rem', sm: '0.375rem' },
        borderRadius: '13px',
        height: '50px',
      }}
      variant="contained"
      onClick={onClick}
      data-testid="toggle-past-trainings-button"
    >
      {text}
    </Button>
  );
}

interface RequestTrainingButtonProps {
  onClick: () => void;
  text: string;
}

export function RequestTrainingButton({
  onClick,
  text,
}: RequestTrainingButtonProps) {
  return (
    <Button onClick={onClick} data-testid="request-button">
      {text}
    </Button>
  );
}
