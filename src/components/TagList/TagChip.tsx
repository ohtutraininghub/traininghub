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
  tagId: string;
  tagName: string;
}

export default function TagChip({ lang, tagId, tagName }: Props) {
  const { t } = useTranslation(lang, 'admin');
  const router = useRouter();
  const { notify } = useMessage();
  const [backdropOpen, setBackdropOpen] = useState(false);

  const confirmTagDeletionMessage = `${t(
    'TagList.confirmTagDeletion'
  )} ${tagName}`;

  const handleDelete = async () => {
    const responseJson = await remove('/api/tag/', {
      tagId: tagId,
    });
    notify(responseJson);
    router.refresh();
  };

  return (
    <>
      <Chip
        label={tagName}
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
          confirmMessage={confirmTagDeletionMessage}
          handleClick={handleDelete}
        />
      )}
    </>
  );
}
