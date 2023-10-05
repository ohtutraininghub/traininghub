import { Prisma } from '@prisma/client';

type TagPrismaType = Prisma.TagGetPayload<Prisma.TagDefaultArgs>;

type TagListProps = {
  tags: TagPrismaType[];
};

export default function TagList({ tags }: TagListProps) {
  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag.name}>{tag.name}</li>
      ))}
    </ul>
  );
}
