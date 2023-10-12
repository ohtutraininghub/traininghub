import TagForm from '@/components/TagForm';
import TagList from '@/components/TagList';
import { prisma } from '@/lib/prisma/prisma';

export const dynamic = 'force-dynamic';

export default async function CreateTag() {
  const tags = await prisma.tag.findMany({
    orderBy: [{ name: 'asc' }],
  });

  return (
    <>
      <h1>Add a new tag</h1>
      <TagForm />
      <h3>Existing tags:</h3>
      <TagList tags={tags} />
    </>
  );
}
