'use client';

import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import CourseFilter from '../CourseFilter/CourseFilter';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import { Tag } from '@prisma/client';
import { Box, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ExpandCircleDown from '@mui/icons-material/ExpandCircleDown';

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleSearchMenu = () => {
    setSearchMenu(!searchMenu);
  };

  const clearSearchParams = () => {
    router.replace(pathname);
  };

  const courseSearchParamsExist =
    searchParams.has('courseName') ||
    searchParams.has('courseDates') ||
    searchParams.has('courseTag');

  return (
    <div>
      <React.Fragment key="top">
        <Button onClick={toggleSearchMenu}>Search</Button>
        {courseSearchParamsExist && (
          <>
            <Typography
              sx={{
                color: palette.white.main,
              }}
            >
              The shown courses are filtered.
            </Typography>
            <Typography
              onClick={clearSearchParams}
              variant="body2"
              sx={{
                cursor: 'pointer',
                color: palette.primary.main,
                textTransform: 'uppercase',
                transition: 'color 0.3s',
                '&:hover': {
                  color: palette.secondary.main,
                },
              }}
            >
              Clear Search
            </Typography>
          </>
        )}
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
              Search for courses
            </Typography>

            <CourseFilter
              initialCourses={initialCourses}
              initialTags={initialTags}
            />
          </Box>
          <Tooltip title="Close menu" placement="bottom">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: palette.coverBlue.main,
                transition: 'background-color 0.3s',
                ':hover': {
                  backgroundColor: palette.coverBlue.light,
                  '& .icon': {
                    color: palette.primary.light,
                  },
                },
              }}
              onClick={toggleSearchMenu}
            >
              <ExpandCircleDown
                className="icon"
                sx={{
                  color: palette.primary.main,
                  transform: 'rotate(180deg)',
                }}
              />
            </Box>
          </Tooltip>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
