'use client';

import { CourseWithInfo } from '@/lib/prisma/courses';
import { CourseModalCloseButton } from '@/components/Buttons/Buttons';
import Modal from '@mui/material/Modal';
import AttendeeTable from '@/components/AttendeeTable';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import EnrollHolder from './EnrollHolder';
import EditButton from './EditButton';
import RemoveButton from './RemoveButton';
import LocalizedDateTime from '../LocalizedDateTime';
import { hasCourseEditRights } from '@/lib/auth-utils';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import { useSession } from 'next-auth/react';
import Loading from '@/app/[lang]/loading';
import { UserNamesAndIds } from '@/lib/prisma/users';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import TrainerTools from './TrainerTools';
import { isTrainerOrAdmin } from '@/lib/auth-utils';
import { useMediaQuery, useTheme } from '@mui/material';
import { ImageContainer } from '../ImageContainer';
import { hasCourseDeleteRights } from '@/lib/auth-utils';
import { useMessage } from '../Providers/MessageProvider';
import { remove } from '../../lib/response/fetchUtil';

interface Props extends DictProps {
  course: CourseWithInfo | undefined;
  usersEnrolledCourseIds: string[];
  enrolledStudents: UserNamesAndIds | null;
  enrolls: string;
  editCourseLabel: string;
}

export default function CourseModal({
  course,
  usersEnrolledCourseIds,
  enrolledStudents,
  lang,
  enrolls,
  editCourseLabel,
}: Props) {
  const { t } = useTranslation(lang, 'components');
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [courseView, setCourseView] = useState<string | null>('details');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { notify } = useMessage();

  //Reset view to course description when modal is opened/closed
  useEffect(() => {
    setCourseView('details');
  }, [course?.id]);

  if (!course) return null;

  if (status === 'loading') {
    return <Loading />;
  }

  const isUserEnrolled = usersEnrolledCourseIds.includes(course.id);
  const isCourseFull = course._count.students === course.maxStudents;
  const hasRightToViewStudents = isTrainerOrAdmin(session.user);
  const hasEditRights = hasCourseEditRights(session.user);

  const handleClick = (event: object, reason: string) => {
    if (reason === 'backdropClick') {
      const params = new URLSearchParams(searchParams);
      params.delete('courseId');
      router.replace(`${pathname}?${params}`);
    }
  };

  const handleCourseViewToggle = (
    event: React.MouseEvent<HTMLElement>,
    newView: string | null
  ) => {
    setCourseView(newView);
  };

  const handleRemove = async () => {
    const responseJson = await remove('/api/course', { courseId: course.id });
    notify(responseJson);
    router.push('/');
    router.refresh();
  };
  return (
    <Modal
      open
      onClose={(event, reason) => handleClick(event, reason)}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        },
      }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '1000px',
          height: '900px',
          maxWidth: '100%',
          maxHeight: '100%',
          overflow: 'auto',
          overflowWrap: 'break-word',
          borderRadius: '10px',
          m: 2,
          p: 3,
          color: 'white.main',
          backgroundColor: 'secondary.main',
          textAlign: 'center',
          outline: 0,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            marginBottom: '1rem',
          }}
        >
          {hasRightToViewStudents && (
            <div style={{ gridColumnStart: 2 }}>
              <TrainerTools
                courseView={courseView}
                handleCourseViewToggle={handleCourseViewToggle}
                viewCourseDetailsLabel={t(
                  'CourseModal.button.viewCourseDetailsLabel'
                )}
                viewEnrolledStudentsLabel={t(
                  'CourseModal.button.viewEnrolledStudentsLabel'
                )}
              />
            </div>
          )}
          <div style={{ gridColumnStart: 3, justifySelf: 'end' }}>
            <CourseModalCloseButton lang={lang} />
          </div>
        </div>
        {course.image && courseView === 'details' && (
          <ImageContainer
            withBorder
            imageUrl={course.image}
            width={isMobile ? 60 : 100}
            height={isMobile ? 60 : 100}
            altText={t('CourseModal.courseImageAltText')}
          />
        )}
        <Typography variant="h1">{course.name}</Typography>
        <Typography variant="h6">
          Created by: {course.createdBy?.name}
        </Typography>
        <Typography sx={{ my: 2 }}>
          <LocalizedDateTime
            variant="range-long"
            startDate={course.startDate}
            endDate={course.endDate}
          />
        </Typography>

        {course.lastEnrollDate && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <PriorityHighOutlinedIcon />
            <Typography>
              {t('CourseModal.enrollmentDeadlineHeader')}
              <LocalizedDateTime variant="long" date={course.lastEnrollDate} />
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          {course.tags.map(({ id, name }) => (
            <Chip
              key={id}
              label={name}
              variant="outlined"
              sx={{ color: 'white.main' }}
            />
          ))}
        </Box>

        {courseView === 'attendees' && (
          <AttendeeTable
            attendees={enrolledStudents}
            noAttendeesText={t('AttendeeList.noAttendeesText')}
          />
        )}

        {courseView === 'details' && (
          <>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                margin: '1em 0 0 0',
                textAlign: 'start',
                paddingRight: '16px',
                overflow: 'auto',
              }}
            >
              <Typography
                sx={{
                  a: {
                    color: 'surface.main',
                    ':visited': {
                      color: 'surface.main',
                    },
                    ':hover': {
                      color: 'secondary.light',
                    },
                  },
                }}
                dangerouslySetInnerHTML={{ __html: course.description }}
              ></Typography>
            </pre>

            <Box
              sx={{
                mt: 'auto',
                pt: 3,
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: { xs: 'coumn', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-end' },
                gap: 1,
              }}
            >
              <Box
                sx={{ alignItems: 'center', display: 'flex', gap: 3, flex: 1 }}
              >
                <EditButton
                  editCourseLabel={editCourseLabel}
                  courseId={course.id}
                  hidden={!hasEditRights}
                />
              </Box>
              <Box sx={{ flex: 1, justifyContent: 'center' }}>
                <Typography sx={{ mb: 1 }}>{enrolls}</Typography>
                <EnrollHolder
                  lang={lang}
                  isUserEnrolled={isUserEnrolled}
                  courseId={course.id}
                  isCourseFull={isCourseFull}
                  lastEnrollDate={course.lastEnrollDate}
                  lastCancelDate={course.lastCancelDate}
                />
              </Box>
              <Box
                sx={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  display: 'flex',
                  gap: 3,
                  flex: 1,
                }}
              >
                {hasCourseDeleteRights(session.user, course) && (
                  <RemoveButton handleDelete={handleRemove} lang={lang} />
                )}
              </Box>
            </Box>
          </>
        )}
      </Card>
    </Modal>
  );
}
