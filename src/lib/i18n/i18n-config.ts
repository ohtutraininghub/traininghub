import api from '@/app/[lang]/locales/en/api.json';
import app from '@/app/[lang]/locales/en/app.json';
import course from '@/app/[lang]/locales/en/course.json';
import profile from '@/app/[lang]/locales/en/profile.json';
import admin from '@/app/[lang]/locales/en/admin.json';
import components from '@/app/[lang]/locales/en/components.json';
import tooltips from '@/app/[lang]/locales/en/tooltips.json';
import zod from '@/app/[lang]/locales/en/zod.json';

export const i18n = {
  defaultLocale: 'en',
  locales: ['en'],
  nameSpaces: [
    'api',
    'app',
    'course',
    'profile',
    'admin',
    'components',
    'tooltips',
  ], // locale filenames
} as const;

export const defaultNS = 'app';

export type Locale = (typeof i18n)['locales'][number];
export type NameSpace = (typeof i18n.nameSpaces)[number];

export const resources = {
  en: {
    tooltips,
    api,
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
    partialBundledLanguages: true,
    resources: {
      en: {
        zod,
        api,
      },
    },
  };
}
