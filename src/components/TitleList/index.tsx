import { Prisma } from '@prisma/client';
import { Typography } from '@mui/material';
import { DictProps, translator } from '@/lib/i18n';
import TitleChip from './TitleChip';

type TitlePrismaType = Prisma.TitleGetPayload<Prisma.TitleDefaultArgs>;

interface TitleListProps extends DictProps {
  titles: TitlePrismaType[];
}

export default async function TitleList({ lang, titles }: TitleListProps) {
  const { t } = await translator('admin');

  if (titles.length === 0) {
    return (
      <Typography variant="body1" mt={1}>
        {`(${t('TitleList.noTitlesAdded')})`}
      </Typography>
    );
  }

  return (
    <ul
      data-testid="title-list"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        padding: 0,
      }}
    >
      {titles.map((title) => (
        <li
          key={title.name}
          style={{
            display: 'inline',
            margin: '0 0.5em 1.2em 0',
          }}
        >
          <TitleChip lang={lang} titleId={title.id} titleName={title.name} />
        </li>
      ))}
    </ul>
  );
}
