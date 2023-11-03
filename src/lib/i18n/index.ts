'server-only';

import { NextRequest } from 'next/server';
import { Locale, i18n, NameSpace, getOptions } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import {
  FlatNamespace,
  KeyPrefix,
  TFunction,
  TFunctionReturnOptionalDetails,
  createInstance,
} from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { FallbackNs } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

export interface DictProps {
  lang: Locale;
}

// Check if there is any supported locale in the pathname
export const checkForMissingLocale = (pathname: string) => {
  return i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );
};

export function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

const initI18next = async (lng: Locale, ns?: NameSpace | NameSpace[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/app/[lang]/locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export async function useTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(lng: Locale, ns?: Ns | Ns[], options: { keyPrefix?: KPrefix } = {}) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}

export const mockTFunction: TFunction<'app', undefined> = function () {
  return {} as TFunctionReturnOptionalDetails<any, any>;
};

// Provide the $TFunctionBrand property to match the TFunction interface
mockTFunction.$TFunctionBrand = 'app';