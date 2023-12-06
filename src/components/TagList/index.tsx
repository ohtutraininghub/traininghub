import { Prisma } from '@prisma/client';
import { Typography } from '@mui/material';
import { DictProps, useTranslation } from '@/lib/i18n';
import TagChip from './TagChip';

type TagPrismaType = Prisma.TagGetPayload<Prisma.TagDefaultArgs>;

interface TagListProps extends DictProps {
  tags: TagPrismaType[];
}

export default async function TagList({ tags, lang }: TagListProps) {
  const { t } = await useTranslation(lang, 'admin');
  const confirmDeleteText = 'Are you sure you want to delete the tag ';

  if (tags.length == 0) {
    return (
      <Typography variant="body1" mt={1}>
        {`(${t('TagList.noTagsAdded')})`}
      </Typography>
    );
  }

  return (
    <ul
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
          <TagChip
            tagId={tag.id}
            tagName={tag.name}
            confirmDeleteText={confirmDeleteText}
          />
        </li>
      ))}
    </ul>
  );
}
