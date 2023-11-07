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
import { DictProps } from '@i18n/index';
import { useTranslation } from '@i18n/client';

interface SearchMenuProps extends DictProps {
  initialCourses: CourseWithTagsAndStudentCount[];
  initialTags: Tag[];
}

export default function SeachMenu({
  initialCourses,
  initialTags,
  lang,
}: SearchMenuProps) {
  const [searchMenu, setSearchMenu] = React.useState(false);
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components', {
    keyPrefix: 'SearchMenu',
  });
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
        <Button onClick={toggleSearchMenu}>
          {t('button.openSearchDrawer')}
        </Button>
        {courseSearchParamsExist && (
          <>
            <Typography
              sx={{
                color: palette.white.main,
              }}
            >
              {t('filterInUse')}
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
              {t('button.clearSearch')}
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
            <Typography
              style={{
                color: 'white',
                fontWeight: '500',
              }}
            >
              {t('menuTitle')}
            </Typography>

            <CourseFilter
              initialCourses={initialCourses}
              initialTags={initialTags}
              lang={lang}
            />
          </Box>
          <Tooltip title={t('tooltip.collapseDrawer')} placement="bottom">
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
