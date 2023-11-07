'use client';

import Button from '@mui/material/Button';
import { ConfirmCard } from '@/components/ConfirmCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessage } from '../Providers/MessageProvider';
import { post } from '@/lib/response/fetchUtil';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@i18n/client';

interface Props extends DictProps {
  courseId: string;
}

export default function EnrollButton({ courseId, lang }: Props) {
  const { t } = useTranslation(lang, 'components');
  const [backdropOpen, setBackdropOpen] = useState(false);
  const router = useRouter();
  const { notify } = useMessage();

  const handleEnroll = async () => {
    const responseJson = await post('/api/course/enroll', courseId);
    notify(responseJson);
    router.refresh();
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
    </>
  );
}
