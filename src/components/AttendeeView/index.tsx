import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import { UserNamesAndIds } from '@/lib/prisma/users';
import AttendeeTable from './AttendeeTable';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import PeopleIcon from '@mui/icons-material/People';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props extends DictProps {
  attendees: UserNamesAndIds | null;
}

export default function AttendeeView({ lang, attendees }: Props) {
  const { t } = useTranslation(lang, 'components');
  const noAttendeesText = t('AttendeeList.noAttendeesText');

  if (!attendees) return null;

  return (
    <Accordion elevation={0}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'white.main' }} />}
        sx={{
          color: 'white.main',
          bgcolor: 'secondary.main',
          '& .MuiAccordionSummary-content': {
            flexGrow: 0,
            justifyContent: 'center',
          },
        }}
      >
        <PeopleIcon />
        <Typography variant="h5" ml={0.5}>
          {t('AttendeeList.header.text')}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <AttendeeTable
          attendees={attendees}
          noAttendeesText={noAttendeesText}
        />
      </AccordionDetails>
    </Accordion>
  );
}
