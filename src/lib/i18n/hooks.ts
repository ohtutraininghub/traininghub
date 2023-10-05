import { useEffect, useState } from 'react';
import { Locale } from './i18n-config';
import en from '@/app/[lang]/dictionaries/en.json';

export const useDictionary = (locale: Locale) => {
  const [dict, setDict] = useState<typeof en>(en);

  useEffect(() => {
    const dictionaries = {
      en: en,
    };
    setDict((prev) => dictionaries?.[locale] ?? prev);
  }, [locale]);

  return dict;
};
