import { useState } from 'react';
import { remove } from '@/lib/response/fetchUtil';
import { useMessage } from '../Providers/MessageProvider';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from '@i18n/client';
import { Box, Button } from '@mui/material';
import { DictProps } from '@/lib/i18n';
import { ConfirmCard } from '../ConfirmCard';
import { useRouter } from 'next/navigation';

interface DeleteTemplateButtonProps extends DictProps {
  templateId: string;
}

export function DeleteTemplateButton({
  templateId,
  lang,
}: DeleteTemplateButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');
  const router = useRouter();
  const { notify } = useMessage();

  const handleDialogOpen = () => {
    console.log('handleDialogOpen');
    setDialogOpen(!dialogOpen);
  };

  const handleConfirm = async () => {
    const responseJson = await remove('/api/template', {
      templateId: templateId,
    });
    notify(responseJson);
    router.push('/en/profile');
    router.refresh();
  };

  return (
    <>
      <Button
        onClick={handleDialogOpen}
        sx={{
          display: 'block',
          margin: 'auto',
          mt: 'auto',
          color: palette.white.main,
          backgroundColor: palette.secondary.main,
          '&:hover': {
            backgroundColor: palette.secondary.light,
          },
        }}
        data-testid="DeleteTemplateButton"
      >
        {t('DeleteTemplateButton.button.delete')}
      </Button>
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <ConfirmCard
          lang={lang}
          backdropOpen={dialogOpen}
          setBackdropOpen={handleDialogOpen}
          confirmMessage={t('DeleteTemplateButton.confirmDelete')}
          handleClick={handleConfirm}
        ></ConfirmCard>
      </Box>
    </>
  );
}
