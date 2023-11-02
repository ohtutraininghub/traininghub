import app from '@/app/[lang]/locales/en/app.json';
import course from '@/app/[lang]/locales/en/course.json';
import profile from '@/app/[lang]/locales/en/profile.json';
import admin from '@/app/[lang]/locales/en/admin.json';
import components from '@/app/[lang]/locales/en/components.json';

export const i18n = {
  defaultLocale: 'en',
  locales: ['en'],
  nameSpaces: ['app', 'course', 'profile', 'admin', 'components'], // locale filenames
} as const;

export const defaultNS = 'app';

export type Locale = (typeof i18n)['locales'][number];
export type NameSpace = (typeof i18n.nameSpaces)[number];

export const resources = {
  en: {
    app,
    course,
    profile,
    admin,
    components,
  },
} as const;

export function getOptions(
  lng: Locale = i18n.defaultLocale,
  ns: NameSpace | NameSpace[] = defaultNS
) {
  return {
    //debug: true,
    supportedLngs: i18n.locales,
    lng: lng,
    fallbackLng: i18n.defaultLocale,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
