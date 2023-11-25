'use client';

import Button from '@mui/material/Button';
import TimerOutlined from '@mui/icons-material/TimerOutlined';
import { ConfirmCard } from '../ConfirmCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessage } from '../Providers/MessageProvider';
import { update } from '@/lib/response/fetchUtil';
import { isPastDeadline } from '@/lib/timedateutils';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@i18n/client';
import InfoBox from './InfoBox';

interface Props extends DictProps {
  courseId: string;
  lastCancelDate: Date | null;
}

export default function CancelEnroll({
  courseId,
  lastCancelDate,
  lang,
}: Props) {
  const { t } = useTranslation(lang, 'components');
  const router = useRouter();
  const [backdropOpen, setBackdropOpen] = useState(false);
  const { notify } = useMessage();

  const handleCancelEnroll = async () => {
    const responseJson = await update('/api/course/enroll', {
      courseId: courseId,
    });
    notify(responseJson);
    router.refresh();
  };

  if (isPastDeadline(lastCancelDate)) {
    return (
      <InfoBox
        infoText={t('CancelEnroll.pastCancellationDate')}
        Icon={TimerOutlined}
      />
    );
  }

  return (
    <>
      <Button
        onClick={() => {
          setBackdropOpen(true);
        }}
      >
        {t('CancelEnroll.cancelEnrollment')}
      </Button>
      <ConfirmCard
        lang={lang}
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={t('CancelEnroll.confirmCancellation')}
        handleClick={handleCancelEnroll}
      />
    </>
  );
}
