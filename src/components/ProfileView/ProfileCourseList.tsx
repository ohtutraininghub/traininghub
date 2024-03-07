'use client';

import React from 'react';
import Link from 'next/link';
import { List, NoSsr } from '@mui/material';
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
import { timeUntilstart } from '@/lib/timedateutils';
import LocalizedDateTime from '../LocalizedDateTime';
import CreateSlackButton from './CreateSlackButton';

export interface ProfileCourseListProps {
  headerText: string;
  courses: Course[];
  open: boolean;
  timer?: boolean;
  id: string;
}

export default function ProfileCourseList({
  headerText,
  courses,
  open,
  timer,
  id,
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
        data-testid={`listHeader.${id}`}
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
            data-testid={`listControls.${id}`}
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
                    href={`profile/?courseId=${course.id}`}
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
                        secondary={
                          <LocalizedDateTime
                            variant="range-long"
                            startDate={course.startDate}
                            endDate={course.endDate}
                          />
                        }
                        sx={{ color: palette.black.main }}
                      />
                      {timer && (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                          }}
                        >
                          <NoSsr>
                            <Chip
                              icon={<TimerIcon />}
                              label={timeUntilstart(course.startDate)}
                              size="small"
                              style={{ marginLeft: 'auto' }}
                            />
                          </NoSsr>
                          <CreateSlackButton
                            lang="en"
                            onclick={() => {}}
                            isSubmitting={false}
                            slackButtonDisabled={false}
                          />
                        </Box>
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
