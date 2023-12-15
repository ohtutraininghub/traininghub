'use client';

import Button from '@mui/material/Button';
import { ConfirmCard } from '@/components/ConfirmCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessage } from '../Providers/MessageProvider';
import { asResponseDataJson, post } from '@/lib/response/fetchUtil';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@i18n/client';
import { StorageType, getItem } from '@/lib/storage';
import { CalendarPrompt } from './CalendarPrompt';
import { signIn } from 'next-auth/react';
import { CALENDAR_SCOPE } from '@/lib/google/constants';

interface Props extends DictProps {
  courseId: string;
}

type CalendarPromptType = {
  open: boolean;
  hasCalendarPermissions: boolean;
};

export default function EnrollButton({ courseId, lang }: Props) {
  const { t } = useTranslation(lang, 'components');
  const [backdropOpen, setBackdropOpen] = useState(false);
  const router = useRouter();
  const { notify } = useMessage();

  const [calendarPrompt, setCalendarPromptOpen] = useState<CalendarPromptType>({
    open: false,
    hasCalendarPermissions: false,
  });

  const handleEnroll = async () => {
    const calendar = getItem(StorageType.INSERT_TO_CALENDAR);

    const responseJson = await post('/api/course/enroll', {
      courseId: courseId,
      insertToCalendar: calendar ?? false,
    });
    notify(responseJson);

    // === false check because it can be undefined
    if (calendar === false) {
      // User has decided to not insert to calendar
      router.refresh();
      return;
    }

    const withDataJson = asResponseDataJson(responseJson);
    const hasCalendarPermissions = !!withDataJson?.data;

    if (calendar === undefined) {
      // User requires prompt for calendar insert
      // This can happen if user pressed enroll for first time
      // Or didn't use 'remember my decision' button

      setCalendarPromptOpen({
        open: true,
        hasCalendarPermissions: hasCalendarPermissions,
      });

      return;
    }

    // Calendar insert is true, so no actions is required
    // Since post already inserted it to calendar
    if (!hasCalendarPermissions) {
      // Unless for some reason user doesn't have permissions...
      // E.g. deleted this 3rd party app, and then relogged
      signIn(
        'google',
        { callbackUrl: `/api/course/calendar?courseId=${courseId}` },
        `scope=${CALENDAR_SCOPE}`
      );
      return;
    }

    router.refresh();
  };

  return (
    <>
      <Button
        onClick={() => {
          setBackdropOpen(true);
        }}
        data-testid="enrollButton"
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
      <CalendarPrompt
        lang={lang}
        open={calendarPrompt.open}
        hideBackdrop={() => {
          setCalendarPromptOpen({ open: false, hasCalendarPermissions: false });
          router.refresh();
        }}
        hasPermissions={calendarPrompt.hasCalendarPermissions}
        courseId={courseId}
      />
    </>
  );
}
