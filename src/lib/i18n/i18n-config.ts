import app from '@/app/[lang]/locales/en/app.json';
import course from '@/app/[lang]/locales/en/course.json';
import profile from '@/app/[lang]/locales/en/profile.json';

export const i18n = {
  defaultLocale: 'en',
  locales: ['en'],
  nameSpaces: ['app', 'course', 'profile'], // locale filenames based on route structure
} as const;

export const defaultNS = 'app';

export type Locale = (typeof i18n)['locales'][number];
export type NameSpace = (typeof i18n.nameSpaces)[number];

export const resources = {
  en: {
    app,
    course,
    profile,
  },
} as const;

export function getOptions(
  lng: Locale = i18n.defaultLocale,
  ns: NameSpace | NameSpace[] = defaultNS
) {
  return {
    // debug: true,
    supportedLngs: i18n.locales,
    en: i18n.defaultLocale,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    resources,
  };
}
