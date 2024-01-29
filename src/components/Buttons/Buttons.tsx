'use client';

import Button from '@mui/material/Button';
import { useState } from 'react';
import { ConfirmCard } from '../ConfirmCard';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@i18n/client';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DeleteTemplateButtonProps {
  templateName: string;
  lang: 'en';
}

export function DeleteTemplateButton({
  templateName,
  lang,
}: DeleteTemplateButtonProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(lang, 'components');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        startIcon={<DeleteIcon />}
        color="secondary"
        onClick={handleClickOpen}
      >
        {t('TemplateDeleteButton.delete')}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to delete ${templateName}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this template will permanently remove it from your
            templates.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

interface SignOutButtonProps extends DictProps {}

export function SignOutButton({ lang }: SignOutButtonProps) {
  const [backdropOpen, setBackdropOpen] = useState(false);
  const { t } = useTranslation(lang, 'components');
  return (
    <>
      <Button
        variant="text"
        sx={{ color: 'black.main', padding: '0.75em' }}
        onClick={() => {
          setBackdropOpen(true);
        }}
      >
        {t('SignOutButton.signOut')}
      </Button>
      <ConfirmCard
        lang={lang}
        backdropOpen={backdropOpen}
        setBackdropOpen={setBackdropOpen}
        confirmMessage={'Confirm sign out?'}
        handleClick={() => signOut()}
      />
    </>
  );
}

interface CourseModalCloseButtonProps extends DictProps {}

export function CourseModalCloseButton({ lang }: CourseModalCloseButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { t } = useTranslation(lang, 'components');

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('courseId');
    router.replace(`${pathname}?${params}`);
  };

  return (
    <Button onClick={handleClick}>{t('CourseModalCloseButton.close')}</Button>
  );
}
