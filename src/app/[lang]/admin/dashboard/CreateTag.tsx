import TagForm from '@/components/TagForm';
import TagList from '@/components/TagList';
import Typography from '@mui/material/Typography';
import { DictProps } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

type Tag = {
  id: string;
  name: string;
};

interface Props extends DictProps {
  tagsHeader: string;
  tags: Tag[];
}

export default function CreateTag({ lang, tagsHeader, tags }: Props) {
  return (
    <div
      style={{
        border: '1px solid lightGrey',
        borderRadius: '5px',
        padding: '1rem',
      }}
    >
      <Typography variant="h2" sx={{ marginBottom: '2rem' }}>
        {tagsHeader}
      </Typography>
      <TagList lang={lang} tags={tags} />
      <TagForm lang={lang} />
    </div>
  );
}
