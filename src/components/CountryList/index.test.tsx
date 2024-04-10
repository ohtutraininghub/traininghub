import { screen } from '@testing-library/react';
import { renderAsyncComponent } from '@/lib/test-utils';
import CountryList from '.';
import componentTranslations from '@/app/[lang]/locales/en/admin.json';

type Component = 'CountryList';
type Translation = keyof typeof componentTranslations.CountryList;

jest.mock('../../lib/i18n', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  translator: () => {
    return {
      t: (str: `${Component}.${Translation}`) => {
        const [component, tr] = str.split('.');
        return componentTranslations[component as Component][tr as Translation];
      },
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

jest.mock('../../lib/i18n/client', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      refresh: jest.fn(),
    };
  },
}));

jest.mock('../Providers/MessageProvider', () => ({
  useMessage() {
    return {
      notify: jest.fn(),
    };
  },
}));

const mockFetch = jest.fn((...args: any[]) =>
  Promise.resolve({
    json: () => Promise.resolve({ args: args }),
    ok: true,
  })
);

jest.mock('../../lib/response/fetchUtil', () => ({
  remove: (...args: any[]) => mockFetch(...args),
}));

const countries = [
  { name: 'Argentina', countryCode: 'AR' },
  { name: 'Brazil', countryCode: 'BR' },
].map((tag, i) => ({ ...tag, id: String(i) }));

describe('Country list tests', () => {
  it('displays the existing countries', async () => {
    await renderAsyncComponent(CountryList, {
      lang: 'en',
      countries: countries,
    });

    countries.forEach((country) => {
      expect(screen.getByText(country.name)).toBeVisible();
    });
  });

  it('displays expected message and no list if the country list is empty', async () => {
    const { container } = await renderAsyncComponent(CountryList, {
      lang: 'en',
      countries: [],
    });

    expect(screen.getByText('(No countries added)')).toBeVisible();
    const tagList = container.querySelector('ul');
    expect(tagList).not.toBeInTheDocument();
  });
});
