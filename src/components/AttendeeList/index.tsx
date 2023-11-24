import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import { UserNamesAndIds } from '@/lib/prisma/users';
import { Box, Divider, List, ListItem, Typography } from '@mui/material';

interface Props extends DictProps {
  attendees: UserNamesAndIds | null;
}

export default function AttendeeList({ lang, attendees }: Props) {
  const { t } = useTranslation(lang, 'components');

  if (!attendees) return null;

  if (attendees.length === 0) {
    return (
      <>
        <Divider
          variant="middle"
          sx={{ bgcolor: 'white.main', my: 3, mx: 0 }}
        />
        <Box>
          <Typography variant="h5">{t('AttendeeList.header.text')}</Typography>
          <Typography variant="body2" sx={{ my: 1 }}>
            {t('AttendeeList.noAttendeesText')}
          </Typography>
        </Box>
      </>
    );
  }
  return (
    <>
      <Divider variant="middle" sx={{ bgcolor: 'white.main', my: 3, mx: 0 }} />
      <Box>
        <Typography variant="h5">{t('AttendeeList.header.text')}</Typography>
        <List>
          {attendees.map((attendee) => (
            <ListItem key={attendee.userId}>{attendee.name}</ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}
