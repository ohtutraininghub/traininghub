import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/lib/test-utils';
import TagList from '.';

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
    renderWithTheme(<TagList lang="en" tags={tags} />);

    tags.forEach((tag) => {
      expect(screen.getByText(tag.name)).toBeVisible();
    });
  });

  it('displays expected message and no list if the tag list is empty', async () => {
    const { container } = renderWithTheme(<TagList lang="en" tags={[]} />);

    expect(screen.getByText('(No tags added)')).toBeVisible();
    const tagList = container.querySelector('ul');
    expect(tagList).not.toBeInTheDocument();
  });
});
