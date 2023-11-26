import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import { UserNamesAndIds } from '@/lib/prisma/users';
import Box from '@mui/material/Box';
import PeopleIcon from '@mui/icons-material/People';
import AttendeeTable from './AttendeeTable';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface Props extends DictProps {
  attendees: UserNamesAndIds | null;
}

export default function AttendeeView({ lang, attendees }: Props) {
  const { t } = useTranslation(lang, 'components');
  const noAttendeesText = t('AttendeeList.noAttendeesText');

  if (!attendees) return null;

  return (
    <Box sx={{ mt: 3, py: 2 }}>
      <PeopleIcon />
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t('AttendeeList.header.text')}
      </Typography>
      <Paper elevation={0}>
        <AttendeeTable
          attendees={attendees}
          noAttendeesText={noAttendeesText}
        />
      </Paper>
    </Box>
  );
}
