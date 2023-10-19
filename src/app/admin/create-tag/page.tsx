import TagForm from '@/components/TagForm';
import TagList from '@/components/TagList';
import { prisma } from '@/lib/prisma';
import Typography from '@mui/material/Typography';

export const dynamic = 'force-dynamic';

export default async function CreateTag() {
  const tags = await prisma.tag.findMany({
    orderBy: [{ name: 'asc' }],
  });

  return (
    <>
      <Typography variant="h3" component="h1">
        Add a new tag
      </Typography>
      <TagForm />
      <Typography variant="h5" component="h2">
        Existing tags:
      </Typography>
      <TagList tags={tags} />
    </>
  );
}
