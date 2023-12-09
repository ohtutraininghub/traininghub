import { screen } from '@testing-library/react';
import { renderAsyncComponent } from '@/lib/test-utils';
import TagList from '.';
import componentTranslations from '@/app/[lang]/locales/en/admin.json';

type Component = 'TagList';
type Translation = keyof typeof componentTranslations.TagList;

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

const tags = [
  { name: 'Agile methods' },
  { name: 'CI/CD' },
  { name: 'Docker' },
  { name: 'Git' },
  { name: 'Jenkins' },
  { name: 'Kubernetes' },
  { name: 'Python' },
  { name: 'Robot Framework' },
  { name: 'Testing' },
].map((tag, i) => ({ ...tag, id: String(i) }));

describe('Tag list tests', () => {
  it('displays the existing tags', async () => {
    await renderAsyncComponent(TagList, { lang: 'en', tags: tags });

    tags.forEach((tag) => {
      expect(screen.getByText(tag.name)).toBeVisible();
    });
  });

  it('displays expected message and no list if the tag list is empty', async () => {
    const { container } = await renderAsyncComponent(TagList, {
      lang: 'en',
      tags: [],
    });

    expect(screen.getByText('(No tags added)')).toBeVisible();
    const tagList = container.querySelector('ul');
    expect(tagList).not.toBeInTheDocument();
  });
});
