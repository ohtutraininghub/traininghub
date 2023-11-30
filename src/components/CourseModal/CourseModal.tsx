'use client';

import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import { CourseModalCloseButton } from '@/components/Buttons/Buttons';
import Modal from '@mui/material/Modal';
import AttendeeView from '@/components/AttendeeView';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import EnrollHolder from './EnrollHolder';
import EditButton from './EditButton';
import LocalizedDateTime from '../LocalizedDateTime';
import { hasCourseEditRights } from '@/lib/auth-utils';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import { useSession } from 'next-auth/react';
import Loading from '@/app/[lang]/loading';
import { UserNamesAndIds } from '@/lib/prisma/users';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import TrainerTools from './TrainerTools';
import { isTrainerOrAdmin } from '@/lib/auth-utils';

interface Props extends DictProps {
  course: CourseWithTagsAndStudentCount | undefined;
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

  if (!course) return null;

  if (status === 'loading') {
    return <Loading />;
  }

  const isUserEnrolled = usersEnrolledCourseIds.includes(course.id);
  const isCourseFull = course._count.students === course.maxStudents;
  const hasRightToViewStudents = isTrainerOrAdmin(session.user);
  const hasEditRights = hasCourseEditRights(session.user, course);

  const handleClick = (event: object, reason: string) => {
    if (reason === 'backdropClick') {
      const params = new URLSearchParams(searchParams);
      params.delete('courseId');
      router.replace(`${pathname}?` + params);
    }
  };

  const handleCourseViewToggle = (
    event: React.MouseEvent<HTMLElement>,
    newView: string | null
  ) => {
    setCourseView(newView);
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
        {hasRightToViewStudents && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              marginBottom: '1rem',
            }}
          >
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
            <div style={{ justifySelf: 'end' }}>
              <CourseModalCloseButton lang={lang} />
            </div>
          </div>
        )}

        <Typography variant="h1">{course.name}</Typography>
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

        {courseView == 'attendees' && (
          <AttendeeView
            attendees={enrolledStudents}
            noAttendeesText={t('AttendeeList.noAttendeesText')}
          />
        )}

        {courseView == 'details' && (
          <Box>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                margin: 0,
                textAlign: 'start',
                paddingRight: '16px',
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
                flexDirection: { xs: 'column-reverse', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-end' },
                gap: 1,
              }}
            >
              <EditButton
                editCourseLabel={editCourseLabel}
                courseId={course.id}
                hidden={!hasEditRights}
              />
              <Box sx={{ flex: 1 }}>
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
              <Box sx={{ flex: 1 }}></Box>
            </Box>
          </Box>
        )}
      </Card>
    </Modal>
  );
}
