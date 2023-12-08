import { Prisma } from '@prisma/client';
import { Typography } from '@mui/material';
import { DictProps, translator } from '@/lib/i18n';
import TagChip from './TagChip';

type TagPrismaType = Prisma.TagGetPayload<Prisma.TagDefaultArgs>;

interface TagListProps extends DictProps {
  tags: TagPrismaType[];
}

export default async function TagList({ lang, tags }: TagListProps) {
  const { t } = await translator('admin');

  if (tags.length == 0) {
    return (
      <Typography variant="body1" mt={1}>
        {`(${t('TagList.noTagsAdded')})`}
      </Typography>
    );
  }

  return (
    <ul
      data-testid="tag-list"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        padding: 0,
      }}
    >
      {tags.map((tag) => (
        <li
          key={tag.name}
          style={{
            display: 'inline',
            margin: '0 0.5em 1.2em 0',
          }}
        >
          <TagChip lang={lang} tagId={tag.id} tagName={tag.name} />
        </li>
      ))}
    </ul>
  );
}
