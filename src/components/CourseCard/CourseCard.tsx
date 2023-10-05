'use client';

import { Button, Card, CardContent, Collapse, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Course } from '@prisma/client';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DictProps } from '@/lib/i18n/i18n';
import { useDictionary } from '@/lib/i18n/hooks';

interface Props extends DictProps {
  course: Course;
}

const CourseCard = ({ course, lang }: Props) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const dict = useDictionary(lang);

  const startDateString = course.startDate.toDateString();
  const endDateString = course.endDate.toDateString();
  const courseDate =
    startDateString === endDateString
      ? startDateString
      : `${startDateString} - ${endDateString}`;

  return (
    <Card
      sx={{
        background: theme.palette.darkBlue.main,
        color: theme.palette.white.main,
        width: 340,
        maxWidth: '100%',
        borderRadius: '15px',
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      <CardContent sx={{ overflowWrap: 'break-word' }}>
        <Typography variant="h5" m={2}>
          {course.name}
        </Typography>
        <Typography>{courseDate}</Typography>
        <Typography>
          {dict.CourseCard.signups.replace('{x}', String(course.maxStudents))}
        </Typography>

        <Button
          onClick={() => setExpanded(!expanded)}
          style={{
            color: theme.palette.info.main,
          }}
        >
          <span>{dict.CourseCard.details}</span>
          <ExpandMoreIcon
            style={{
              transform: expanded ? 'rotate(180deg)' : '',
            }}
          />
        </Button>
        <Collapse in={expanded}>
          <Typography variant="h6">
            {dict.CourseCard.courseDescription}
          </Typography>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            <Typography sx={{ px: 2, textAlign: 'start' }}>
              {course.description}
            </Typography>
          </pre>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
