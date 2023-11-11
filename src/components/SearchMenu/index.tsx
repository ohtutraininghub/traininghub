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
import { keyframes } from '@mui/system';

interface SearchMenuProps extends DictProps {
  initialCourses: CourseWithTagsAndStudentCount[];
  initialTags: Tag[];
}

const nudgeAnimation = keyframes`
  0% {
    transform: translateY(0) rotate(180deg);
  }
  25% {
    transform: translateY(-3px) rotate(180deg);
  }
  50% {
    transform: translateY(0) rotate(180deg);
  }
  75% {
    transform: translateY(-3px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(180deg);
  }
`;

export default function SearchMenu({
  initialCourses,
  initialTags,
  lang,
}: SearchMenuProps) {
  const [searchMenu, setSearchMenu] = React.useState(false);
  const theme = useTheme();
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
    searchParams.has('startDate') ||
    searchParams.has('endDate') ||
    searchParams.has('courseTag');

  return (
    <div>
      <React.Fragment key="top">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Button onClick={toggleSearchMenu}>
            {t('button.openSearchDrawer')}
          </Button>
          {courseSearchParamsExist && (
            <>
              <Typography
                sx={{
                  color: theme.palette.white.main,
                  fontSize: '0.8em',
                }}
              >
                {t('filterInUse')}
              </Typography>
              <Typography
                onClick={clearSearchParams}
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.7em',
                  color: theme.palette.primary.main,
                  textTransform: 'uppercase',
                  transition: 'color 0.3s',
                  '&:hover': {
                    color: theme.palette.secondary.main,
                  },
                }}
              >
                {t('button.clearSearch')}
              </Typography>
            </>
          )}
        </Box>
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
              backgroundColor: theme.palette.coverBlue.light,
            }}
          >
            <Typography
              sx={{
                color: theme.palette.white.main,
                fontSize: '20px',
                fontWeight: '500',
                paddingBottom: '0.5em',
                [theme.breakpoints.down('sm')]: {
                  display: 'none',
                },
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
                backgroundColor: theme.palette.coverBlue.main,
                transition: 'background-color 0.3s',
                ':hover': {
                  backgroundColor: theme.palette.coverBlue.light,
                  '& .icon': {
                    color: theme.palette.primary.light,
                    animation: `${nudgeAnimation} 1s ease infinite`,
                  },
                },
              }}
              onClick={toggleSearchMenu}
              data-testid="close-drawer"
            >
              <ExpandCircleDown
                className="icon"
                sx={{
                  color: theme.palette.primary.main,
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
