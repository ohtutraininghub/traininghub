'use client';

import {
  Button,
  Card,
  CardContent,
  Collapse,
  Typography,
  useTheme,
} from '@mui/material';
import { Course } from '@prisma/client';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Props = {
  course: Course;
};

const CourseCard = ({ course }: Props) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

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
        <Typography>{course.startDate.toLocaleString()}</Typography>
        <Typography>Signups: 0 / {course.maxStudents}</Typography>

        <Button
          onClick={() => setExpanded(!expanded)}
          style={{
            color: theme.palette.info.main,
          }}
        >
          <span>View details</span>
          <ExpandMoreIcon
            style={{
              transform: expanded ? 'rotate(180deg)' : '',
            }}
          />
        </Button>
        <Collapse in={expanded}>
          <Typography variant="h6">Course description</Typography>
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
