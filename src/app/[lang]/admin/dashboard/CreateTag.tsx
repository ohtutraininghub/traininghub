import TagForm from '@/components/TagForm';
import TagList from '@/components/TagList';
import Typography from '@mui/material/Typography';
import { DictProps } from '@/lib/i18n';
import { Paper } from '@mui/material';

export const dynamic = 'force-dynamic';

type Tag = {
  id: string;
  name: string;
};

interface Props extends DictProps {
  newTagLabel: string;
  existingTagLabel: string;
  tags: Tag[];
}

export default function CreateTag({
  lang,
  newTagLabel,
  existingTagLabel,
  tags,
}: Props) {
  return (
    <Paper>
      <Typography variant="h3" component="h1">
        {newTagLabel}
      </Typography>
      <TagForm lang={lang} />
      <Typography variant="h5" component="h2">
        {existingTagLabel}
      </Typography>
      <TagList lang={lang} tags={tags} />
    </Paper>
  );
}
