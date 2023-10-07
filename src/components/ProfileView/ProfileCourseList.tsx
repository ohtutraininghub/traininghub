'use client';

import React from 'react';
import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Divider from '@mui/material/Divider/Divider';
import { Course } from '@prisma/client';
import { useTheme } from '@mui/material/styles';
import { Box, Tooltip, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

export interface ProfileCourseListProps {
  headerText: string;
  courses: Course[];
  open: boolean;
}

export default function ProfileCourseList({
  headerText,
  courses,
  open,
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
          backgroundColor: palette.darkBlue.main,
          color: palette.white.main,
          paddingLeft: '10px',
        }}
        variant="subtitle2"
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
          >
            {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
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
                backgroundColor: palette.secondary.main,
              }}
            >
              {courses.map((course: Course, count: number) => (
                <React.Fragment key={course.id}>
                  <ListItem key={course.id}>
                    <ListItemText
                      primary={course.name}
                      secondary={`${course.startDate.toDateString()} - ${course.endDate.toDateString()}`}
                    />
                  </ListItem>
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
