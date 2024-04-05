'use client';

import Chip from '@mui/material/Chip';
import { ConfirmCard } from '../ConfirmCard';
import { remove } from '@/lib/response/fetchUtil';
import { useState } from 'react';
import { useMessage } from '../Providers/MessageProvider';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/client';
import { DictProps } from '@/lib/i18n';

interface Props extends DictProps {
  titleId: string;
  titleName: string;
}

export default function TitleChip({ lang, titleId, titleName }: Props) {
  const { t } = useTranslation(lang, 'admin');
  const router = useRouter();
  const { notify } = useMessage();
  const [backdropOpen, setBackdropOpen] = useState(false);

  const confirmTitleDeletionMessage = `${t(
    'TitleList.confirmTitleDeletion'
  )} ${titleName}`;

  const handleDelete = async () => {
    const responseJson = await remove('/api/title/', {
      titleId: titleId,
    });
    notify(responseJson);
    router.refresh();
  };

  return (
    <>
      <Chip
        label={titleName}
        variant={'outlined'}
        onDelete={() => {
          setBackdropOpen(true);
        }}
      />
      {backdropOpen && (
        <ConfirmCard
          lang={lang}
          backdropOpen={backdropOpen}
          setBackdropOpen={setBackdropOpen}
          confirmMessage={confirmTitleDeletionMessage}
          handleClick={handleDelete}
        />
      )}
    </>
  );
}
