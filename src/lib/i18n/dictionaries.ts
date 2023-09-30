import 'server-only';
import type { Locale } from './i18n-config';

const dictionaries = {
  en: () =>
    import('@/app/[lang]/dictionaries/en.json').then(
      (module) => module.default
    ),
};

// default to en, in case locale is not set
export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();
