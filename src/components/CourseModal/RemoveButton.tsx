import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { ConfirmCard } from '../ConfirmCard';
import { useTranslation } from '@i18n/client';
import { DictProps } from '@/lib/i18n';

interface Props extends DictProps {
  handleDelete: () => void;
}

const RemoveButton = ({ handleDelete, lang }: Props) => {
  const { t } = useTranslation(lang, 'components');
  const [backdropOpen, setBackdropOpen] = useState(false);

  return (
    <Box
      sx={{
        justifyContent: 'flex-start',
      }}
    >
      <Button
        data-testid="removeCourseButton"
        style={{ textDecoration: 'none', color: 'inherit' }}
        onClick={() => {
          setBackdropOpen(true);
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
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
        handleClick={handleDelete}
      ></ConfirmCard>
    </Box>
  );
};

export default RemoveButton;
