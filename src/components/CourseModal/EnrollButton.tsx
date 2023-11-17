'use client';

import Button from '@mui/material/Button';
import { ConfirmCard } from '@/components/ConfirmCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessage } from '../Providers/MessageProvider';
import { post } from '@/lib/response/fetchUtil';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@i18n/client';
import { StorageType, getItem, setItem } from '@/lib/storage';
import { signIn } from 'next-auth/react';
import { CALENDAR_SCOPE } from '@/lib/google/constants';

interface Props extends DictProps {
  courseId: string;
}

export default function EnrollButton({ courseId, lang }: Props) {
  const { t } = useTranslation(lang, 'components');
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [calendarPromptOpen, setCalendarPromptOpen] = useState(false);
  const router = useRouter();
  const { notify } = useMessage();

  const handleEnroll = async () => {
    const responseJson = await post('/api/course/enroll', courseId);
    notify(responseJson);

    const calendar = getItem(StorageType.INSERT_TO_CALENDAR);
    if (calendar !== 'true' && calendar !== 'false') {
      setCalendarPromptOpen(true);
    } else {
      router.refresh();
    }
  };

  const handleCalendar = async () => {
    setItem(StorageType.INSERT_TO_CALENDAR, 'true');
    // check if scope already exists before sign in flow
    signIn(
      'google',
      { callbackUrl: `/api/course/calendar?courseId=${courseId}` },
      `scope=${CALENDAR_SCOPE}`
    );
  };

  return (
    <>
      <Button
        onClick={() => {
          setBackdropOpen(true);
        }}
      >
        {t('EnrollButton.enroll')}
      </Button>
      <ConfirmCard
        lang={lang}
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={t('EnrollButton.confirmEnroll')}
        handleClick={() => handleEnroll()}
      />
      <ConfirmCard
        lang={lang}
        backdropOpen={calendarPromptOpen}
        setBackdropOpen={setCalendarPromptOpen}
        confirmMessage={'Test stuff'}
        handleClick={() => handleCalendar()}
      />
    </>
  );
}
