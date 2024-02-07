import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from '@/lib/i18n/client';
import { DictProps } from '@/lib/i18n';

interface EditTemplateButtonProps extends DictProps {
  templateId: string;
}

export function EditTemplateButton({
  templateId,
  lang,
}: EditTemplateButtonProps) {
  const { t } = useTranslation(lang, 'components');

  return (
    <Box sx={{ display: 'flex', flex: 1 }}>
      <Link
        style={{ textDecoration: 'none', color: 'inherit' }}
        href={`/template/${templateId}/edit`}
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
          <Typography>{t('EditTemplateButton.button.edit')}</Typography>
        </Box>
      </Link>
    </Box>
  );
}
