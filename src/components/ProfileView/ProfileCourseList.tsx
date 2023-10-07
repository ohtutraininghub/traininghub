'use client'

import React from "react";
import List from '@mui/material/List/List';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Divider from "@mui/material/Divider/Divider";
import { Course } from '@prisma/client';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from "@mui/material";


export interface ProfileCourseListProps {
  headerText: string;
  courses: Course[];
}

export default function ProfileCourseList({
  headerText,
  courses,
}: ProfileCourseListProps) {
  const { palette } = useTheme();
  
  return (
    <Box
      sx={{
        paddingTop: '10px'
      }}>
      <Typography 
        sx={{
          backgroundColor: palette.darkBlue.main,
          color: palette.white.main,
          paddingLeft: '10px',
        }}
        variant='subtitle2'>
          {`${headerText} (${courses.length})`}
      </Typography>
      <List
        style={{
          backgroundColor: palette.secondary.main
        }}>
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
    </Box>
  );
}
