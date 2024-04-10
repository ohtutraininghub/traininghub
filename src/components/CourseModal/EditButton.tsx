import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';

interface Props extends DictProps {
  courseId: string;
  hidden: boolean;
}

export default function EditButton({ lang, courseId, hidden }: Props) {
  const { t } = useTranslation(lang, 'components');
  return (
    <Box sx={{ display: 'flex', flex: 1 }}>
      <Link
        style={{ textDecoration: 'none', color: 'inherit' }}
        href={`/course/${courseId}/edit`}
        hidden={hidden}
        data-testid="editCourseButton"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            px: '8px',
            py: '6px',
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
