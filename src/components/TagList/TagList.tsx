import { Prisma } from '@prisma/client';
import Box from '@mui/material/Box';

type TagPrismaType = Prisma.TagGetPayload<Prisma.TagDefaultArgs>;

type TagListProps = {
  tags: TagPrismaType[];
};

export default function TagList({ tags }: TagListProps) {
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
          <Box
            component="span"
            sx={{
              border: '1px solid',
              borderRadius: '4px',
              p: '0.5em',
            }}
          >
            {tag.name}
          </Box>
        </li>
      ))}
    </ul>
  );
}
