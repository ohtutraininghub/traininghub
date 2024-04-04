import TitleForm from '@/components/TitleForm';
import TitleList from '@/components/TitleList';
import Typography from '@mui/material/Typography';
import { DictProps } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

type Title = {
  id: string;
  name: string;
};

interface Props extends DictProps {
  titlesHeader: string;
  titles: Title[];
}

export default function CreateTitle({ lang, titlesHeader, titles }: Props) {
  return (
    <div
      style={{
        border: '1px solid lightGrey',
        borderRadius: '5px',
        padding: '1rem',
      }}
    >
      <Typography variant="h2" sx={{ marginBottom: '2rem' }}>
        {titlesHeader}
      </Typography>
      <TitleList lang={lang} titles={titles} />
      <TitleForm lang={lang} />
    </div>
  );
}
