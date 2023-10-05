import TagForm from '@/components/TagForm/TagForm';
import TagList from '@/components/TagList/TagList';
import { prisma } from '@/lib/prisma';
import Box from '@mui/material/Box';

export default async function CreateTag() {
  const tags = await prisma.tag.findMany({
    orderBy: [{ name: 'asc' }],
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mx: 1,
        my: 1,
      }}
    >
      <h1>Add a new tag</h1>
      <TagForm />
      <h3>Existing tags:</h3>
      <TagList tags={tags} />
    </Box>
  );
}
