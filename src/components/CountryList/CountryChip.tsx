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
  countryId: string;
  countryName: string;
}

export default function CountryChip({ lang, countryId, countryName }: Props) {
  const { t } = useTranslation(lang, 'admin');
  const router = useRouter();
  const { notify } = useMessage();
  const [backdropOpen, setBackdropOpen] = useState(false);

  const confirmCountryDeletionMessage = `${t(
    'CountryList.confirmCountryDeletion'
  )} ${countryName}`;

  const handleDelete = async () => {
    const responseJson = await remove('/api/country/', {
      id: countryId,
    });
    console.log(
      '---------------------------------------------------------------------------',
      responseJson
    );
    notify(responseJson);
    router.refresh();
  };

  return (
    <>
      <Chip
        label={countryName}
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
          confirmMessage={confirmCountryDeletionMessage}
          handleClick={handleDelete}
        />
      )}
    </>
  );
}
