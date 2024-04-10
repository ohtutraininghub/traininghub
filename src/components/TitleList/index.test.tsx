import { screen } from '@testing-library/react';
import { renderAsyncComponent } from '@/lib/test-utils';
import TitleList from '.';
import componentTranslations from '@/app/[lang]/locales/en/admin.json';

type Component = 'TitleList';
type Translation = keyof typeof componentTranslations.TitleList;

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

const titles = [{ name: 'Boss' }, { name: 'Employee' }, { name: 'CEO' }].map(
  (title, i) => ({ ...title, id: String(i) })
);

describe('Title list tests', () => {
  it('displays the existing titles', async () => {
    await renderAsyncComponent(TitleList, { lang: 'en', titles: titles });

    titles.forEach((title) => {
      expect(screen.getByText(title.name)).toBeVisible();
    });
  });

  it('displays expected message and no list if the title list is empty', async () => {
    const { container } = await renderAsyncComponent(TitleList, {
      lang: 'en',
      titles: [],
    });

    expect(screen.getByText('(No titles added)')).toBeVisible();
    const titleList = container.querySelector('ul');
    expect(titleList).not.toBeInTheDocument();
  });
});
