'use client';

import * as React from 'react';

import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import CourseFilter from '../CourseFilter/CourseFilter';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import { Tag } from '@prisma/client';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type SearchMenuProps = {
  initialCourses: CourseWithTagsAndStudentCount[];
  initialTags: Tag[];
};

export default function SeachMenu({
  initialCourses,
  initialTags,
}: SearchMenuProps) {
  const [searchMenu, setSearchMenu] = React.useState(false);
  const { palette } = useTheme();
  const toggleSearchMenu = () => {
    setSearchMenu(!searchMenu);
  };

  return (
    <div>
      <React.Fragment key="top">
        <Button onClick={toggleSearchMenu}>Search</Button>
        <Drawer
          anchor="top"
          open={searchMenu}
          onClose={toggleSearchMenu}
          sx={{
            backgroundColor: 'none',
            height: '40vh',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '40vh',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: palette.coverBlue.light,
            }}
          >
            <Typography style={{ color: 'white' }}>
              Searchy thingies here
            </Typography>
            <CourseFilter
              initialCourses={initialCourses}
              initialTags={initialTags}
            />
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
