'use client';

import ProfileUserDetails from '@/components/ProfileView/ProfileUserDetails';
import ProfileCourseList from '@/components/ProfileView/ProfileCourseList';
import ProfileTemplateList from '@/components/ProfileView/ProfileTemplateList';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Country, Course, Tag, Title, User } from '@prisma/client';
import { PropsWithChildren, SyntheticEvent, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { isTrainerOrAdmin, isAdmin } from '@/lib/auth-utils';
import { TemplateWithCreator } from '@/lib/prisma/templates';
import { DictProps } from '@i18n/index';
import { useTranslation } from '@i18n/client';
import { useParams } from 'next/navigation';

export interface userDetails {
  name: string;
  email: string;
  image: string;
  country: string;
  title: string;
}

export interface ProfileViewProps extends PropsWithChildren, DictProps {
  tags: Tag[];
  countries: Country[];
  titles: Title[];
  userDetails: userDetails;
  courses: Course[];
  createdCourses: Course[];
  users: User[];
  templates: TemplateWithCreator[];
}

export default function ProfileView({
  lang,
  userDetails,
  courses,
  createdCourses,

  children,
  templates,
  tags,
}: ProfileViewProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');
  const currentDate = new Date();
  const { data: session } = useSession({ required: true });
  const userId = session?.user?.id;
  const params = useParams();
  const profileId = params.id;
  const ownProfile = userId === profileId;

  const handleChangeTab = (
    event: SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    setSelectedTab(newValue);
  };

  return (
    <div style={{ paddingBottom: '20px', paddingTop: '32px' }}>
      <ProfileUserDetails
        name={userDetails.name}
        email={userDetails.email}
        image={userDetails.image}
        country={userDetails.country}
        title={userDetails.title}
      />
      <Tabs
        value={selectedTab}
        onChange={handleChangeTab}
        centered
        sx={{
          '& .MuiTab-root': {
            color: `${palette.secondary.main} !important`,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: palette.secondary.main,
          },
        }}
      >
        <Tab
          label={
            ownProfile
              ? t('ProfileView.label.myEnrollments')
              : t('ProfileView.label.Enrollments')
          }
          data-testid="myEnrollmentsTab"
        />
        {isTrainerOrAdmin((session?.user as User) || {}) && (
          <Tab
            label={
              ownProfile
                ? t('ProfileView.label.myCourses')
                : t('ProfileView.label.Courses')
            }
            data-testid="myCoursesTab"
          />
        )}
        {isAdmin((session?.user as User) || {}) && ownProfile && (
          <Tab
            label={t('ProfileView.label.adminDashboard')}
            data-testid="adminDashboardTab"
          />
        )}
      </Tabs>

      {selectedTab === 0 && (
        <>
          <ProfileCourseList
            lang={lang}
            headerText={t('ProfileView.header.coursesInprogress')}
            courses={courses.filter(
              (course: Course) =>
                course.startDate <= currentDate && course.endDate >= currentDate
            )}
            open={true}
            id={'inprogressCourses'}
          />
          <ProfileCourseList
            lang={lang}
            headerText={t('ProfileView.header.upcomingCourses')}
            courses={courses.filter(
              (course: Course) => course.startDate > currentDate
            )}
            open={true}
            timer={true}
            id={'upcomingCourses'}
          />
          <ProfileCourseList
            lang={lang}
            headerText={t('ProfileView.header.endedCourses')}
            courses={courses.filter(
              (course: Course) => course.endDate < currentDate
            )}
            open={false}
            id={'endedCourses'}
          />
        </>
      )}
      {selectedTab === 1 && (
        <>
          <ProfileCourseList
            lang={lang}
            headerText={t('ProfileView.header.createdCourses')}
            courses={createdCourses.filter(
              (createdCourse: Course) =>
                createdCourse.startDate >= currentDate ||
                createdCourse.endDate >= currentDate
            )}
            open={true}
            timer={true}
            id={'upcomingCreated'}
          />
          <ProfileCourseList
            lang={lang}
            headerText={t('ProfileView.header.endedCreatedCourses')}
            courses={createdCourses.filter(
              (createdCourse: Course) => createdCourse.endDate < currentDate
            )}
            open={true}
            id={'endedCreated'}
          />
          <ProfileTemplateList
            headerText={
              isAdmin((session?.user as User) || {}) && ownProfile
                ? t('ProfileView.header.templatesAdmin')
                : !ownProfile
                  ? t('ProfileView.header.templates')
                  : t('ProfileView.header.templatesTrainer')
            }
            templates={templates}
            tags={tags}
            open={false}
          />
        </>
      )}
      {selectedTab === 2 && (
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
