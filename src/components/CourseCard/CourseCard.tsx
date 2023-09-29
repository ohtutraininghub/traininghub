'use client';

import { Button, Card, CardContent, Collapse, useTheme } from '@mui/material';
import { Course } from '@prisma/client';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CourseCard = ({ course }: { course: Course }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  return (
    <Card
      sx={{
        background: theme.palette.darkBlue.main,
        color: theme.palette.white.main,
        width: 340,
        borderRadius: '15px',
        textAlign: 'center',
      }}
    >
      <CardContent>
        <h3>{course.name}</h3>
        <p>{course.startDate.toLocaleString()}</p>
        <p>Signups: 0 / {course.maxStudents}</p>

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
          <h3>Course description</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            <p>{course.description}</p>
          </pre>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
