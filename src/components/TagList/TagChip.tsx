'use client';

import Chip from '@mui/material/Chip';
import { ConfirmCard } from '../ConfirmCard';
import { remove } from '@/lib/response/fetchUtil';
import { useState } from 'react';
import { useMessage } from '../Providers/MessageProvider';
import { useRouter } from 'next/navigation';

interface Props {
  tagId: string;
  tagName: string;
  confirmDeleteText: string;
}

export default function TagChip({ tagId, tagName, confirmDeleteText }: Props) {
  const router = useRouter();
  const { notify } = useMessage();
  const [backdropOpen, setBackdropOpen] = useState(false);

  const handleDelete = async () => {
    const responseJson = await remove('/api/tag/', {
      tagId: tagId,
    });
    notify(responseJson);
    router.refresh();
  };

  function handleDeleteBtnClick() {
    setBackdropOpen(true);
  }

  return (
    <>
      <Chip
        label={tagName}
        variant={'outlined'}
        onDelete={() => {
          handleDeleteBtnClick();
        }}
      />
      <ConfirmCard
        lang="en"
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={`${confirmDeleteText} \'${tagName}?\'`}
        handleClick={handleDelete}
      />
    </>
  );
}
