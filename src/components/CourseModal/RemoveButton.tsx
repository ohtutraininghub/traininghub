import { Box, Button } from '@mui/material';
import { remove } from '../../lib/response/fetchUtil';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMessage } from '../Providers/MessageProvider';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { ConfirmCard } from '../ConfirmCard';
import { useTranslation } from '@i18n/client';
import { DictProps } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

interface Props extends DictProps {
  courseId: string;
  hidden: boolean;
}

const RemoveButton = ({ courseId, hidden, lang }: Props) => {
  const { t } = useTranslation(lang, 'components');
  const [backdropOpen, setBackdropOpen] = useState(false);
  const { notify } = useMessage();
  const router = useRouter();

  const handleClick = async () => {
    const responseJson = await remove('/api/course', { courseId: courseId });
    notify(responseJson);
    router.push('/');
    router.refresh();
  };

  return (
    <Box sx={{ justifyContent: 'flex-start' }}>
      <Button
        style={{ textDecoration: 'none', color: 'inherit' }}
        hidden={hidden}
        onClick={() => {
          setBackdropOpen(true);
        }}
      >
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
          <DeleteIcon />
          <Typography textTransform={'capitalize'}>
            {t('RemoveCourse.button.text')}
          </Typography>
        </Box>
      </Button>

      <ConfirmCard
        lang={lang}
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={t('ConfirmRemoveCourse.button.text')}
        handleClick={handleClick}
      ></ConfirmCard>
    </Box>
  );
};

export default RemoveButton;
