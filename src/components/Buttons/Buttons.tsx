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
    <Button onClick={handleClick}>{t('CourseModalCloseButton.close')}</Button>
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
    <Button variant="contained" onClick={onClick}>
      {text}
    </Button>
  );
}
