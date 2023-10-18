'use client';

import React from 'react';
import Link from 'next/link';
import { List } from '@mui/material';
import { ListItem } from '@mui/material';
import { ListItemText } from '@mui/material';
import { Divider } from '@mui/material';
import { Course } from '@prisma/client';
import { useTheme } from '@mui/material/styles';
import { Box, Tooltip, Typography } from '@mui/material';
import { Chip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import TimerIcon from '@mui/icons-material/Timer';
import { useState } from 'react';
import { formatDate, daysUntilStart } from '@/lib/timedateutils';

export interface ProfileCourseListProps {
  headerText: string;
  courses: Course[];
  open: boolean;
  timer?: boolean;
}

export default function ProfileCourseList({
  headerText,
  courses,
  open,
  timer,
}: ProfileCourseListProps) {
  const { palette } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(open);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      sx={{
        paddingTop: '10px',
      }}
    >
      <Typography
        sx={{
          backgroundColor: palette.secondary.main,
          color: palette.white.main,
          paddingLeft: '10px',
        }}
        variant="subtitle2"
        data-testid="listHeader"
      >
        {`${headerText} (${courses.length})`}
        <Tooltip
          title={isCollapsed ? 'Close' : 'Expand'}
          arrow
          placement="right"
        >
          <IconButton
            sx={{ color: palette.white.main }}
            onClick={handleToggleCollapse}
            data-testid="listControls"
          >
            {isCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Tooltip>
      </Typography>
      {!isCollapsed ? null : (
        <>
          {courses.length === 0 ? (
            <Typography
              sx={{
                padding: '10px',
              }}
              variant="body2"
            >
              No courses to show.
            </Typography>
          ) : (
            <List
              style={{
                backgroundColor: palette.surface.main,
              }}
            >
              {courses.map((course: Course, count: number) => (
                <React.Fragment key={course.id}>
                  <Link
                    href={`/profile/?courseId=${course.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <ListItem
                      key={course.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: palette.surface.light,
                        },
                      }}
                    >
                      <ListItemText
                        primary={course.name}
                        secondary={`${formatDate({
                          date: course.startDate,
                        })} - ${formatDate({ date: course.endDate })}`}
                        sx={{ color: palette.black.main }}
                      />
                      {timer && (
                        <Chip
                          icon={<TimerIcon />}
                          label={
                            daysUntilStart(course.startDate) === 0
                              ? 'Starts today'
                              : daysUntilStart(course.startDate) === 1
                              ? 'Starts in 1 day'
                              : `Starts in ${daysUntilStart(
                                  course.startDate
                                )} days`
                          }
                          size="small"
                          style={{ marginLeft: 'auto' }}
                        />
                      )}
                    </ListItem>
                  </Link>
                  {count < courses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </>
      )}
    </Box>
  );
}
