import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import { DictProps, useTranslation } from '@i18n/index';

interface Props extends DictProps {
  courseId: string;
}

export default async function EditButton({ courseId, lang }: Props) {
  const { t } = await useTranslation(lang, 'components');
  return (
    <Box sx={{ display: 'flex', flex: 1 }}>
      <Link style={{ all: 'unset' }} href={`/course/${courseId}/edit`}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row-reverse', sm: 'column' },
            alignItems: 'center',
            width: 'fit-content',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
              color: 'info.main',
            },
          }}
        >
          <EditIcon />
          <Typography>{t('EditButton.editCourse')}</Typography>
        </Box>
      </Link>
    </Box>
  );
}
