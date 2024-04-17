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
import CreateFeedbackButton from './CreateFeedbackButton';
import { post } from '@/lib/response/fetchUtil';
import { DictProps } from '@/lib/i18n';
import { useRouter, useParams } from 'next/navigation';
import { useMessage } from '../Providers/MessageProvider';
import { useSession } from 'next-auth/react';

export interface ProfileCourseListProps extends DictProps {
  headerText: string;
  courses: Course[];
  open: boolean;
  timer?: boolean;
  id: string;
}

export default function ProfileCourseList({
  lang,
  headerText,
  courses,
  open,
  timer,
  id,
}: ProfileCourseListProps) {
  const { palette } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(open);
  const { notify } = useMessage();
  const router = useRouter();
  const { data: session } = useSession({ required: true });
  const params = useParams();
  const profileId = params.id;
  const userId = session?.user.id;

  const ownProfile = userId === profileId;

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isCourseInProgress = (course: Course) => {
    const currentDate = new Date();
    return course.startDate <= currentDate && course.endDate >= currentDate;
  };
  const handleCreateNewChannel = async (id: string) => {
    const responseJson = await post('/api/slack/channel', { courseId: id });
    notify(responseJson);
    router.push(`/${lang}/profile/${session?.user.id}`);
    router.refresh();
  };
  const handleCreateNewFeedback = async (id: string) => {
    const responseJson = await post('/api/forms/create', { courseId: id });
    notify(responseJson);
    router.refresh();
    router.push(`/${lang}/profile/${session?.user.id}`);
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
                    href={`/${lang}/profile/${profileId}?courseId=${course.id}`}
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
                            mr: '0.5em',
                          }}
                        >
                          <NoSsr>
                            <Chip
                              icon={<TimerIcon />}
                              label={
                                isCourseInProgress(course)
                                  ? 'In Progress'
                                  : timeUntilstart(course.startDate)
                              }
                              size="small"
                              sx={{
                                marginLeft: 'auto',
                              }}
                              color={
                                isCourseInProgress(course)
                                  ? 'success'
                                  : 'default'
                              }
                              data-testid={`courseTimer.${course.id}`}
                            />
                          </NoSsr>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 1,
                              flexDirection: { xs: 'column', sm: 'row' },
                            }}
                          >
                            {ownProfile && (
                              <CreateSlackButton
                                lang={lang}
                                onclick={(
                                  event: React.MouseEvent<HTMLButtonElement>
                                ) => {
                                  {
                                    event.preventDefault(); // prevents the CourseModal from opening
                                    handleCreateNewChannel(course.id);
                                  }
                                }}
                                buttonDisabled={Boolean(course.slackChannelId)}
                              />
                            )}
                            {ownProfile && (
                              <CreateFeedbackButton
                                lang={lang}
                                onclick={(
                                  event: React.MouseEvent<HTMLButtonElement>
                                ) => {
                                  {
                                    event.preventDefault(); // prevents the CourseModal from opening
                                    handleCreateNewFeedback(course.id);
                                  }
                                }}
                                buttonDisabled={Boolean(course.googleFormsId)}
                              />
                            )}
                          </Box>
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
