'use client';

import ProfileUserDetails from '@/components/ProfileView/ProfileUserDetails';
import ProfileCourseList from '@/components/ProfileView/ProfileCourseList';
import ProfileTemplateList from '@/components/ProfileView/ProfileTemplateList';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Course, User } from '@prisma/client';
import { PropsWithChildren, SyntheticEvent, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import UserList from '@/components/UserList';
import { isTrainerOrAdmin, isAdmin } from '@/lib/auth-utils';
import { TemplateWithCreator } from '@/lib/prisma/templates';
import { Tag } from '@prisma/client';
import { DictProps } from '@i18n/index';
import { useTranslation } from '@i18n/client';

export interface userDetails {
  name: string;
  email: string;
  image: string;
}

export interface ProfileViewProps extends PropsWithChildren, DictProps {
  tags: Tag[];
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
  users,
  children,
  templates,
  tags,
}: ProfileViewProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const { palette } = useTheme();
  const { t } = useTranslation(lang, 'components');
  const currentDate = new Date();
  const { data: session } = useSession();

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
          label={t('ProfileView.label.myEnrollments')}
          data-testid="myEnrollmentsTab"
        />
        {isTrainerOrAdmin((session?.user as User) || {}) && (
          <Tab
            label={t('ProfileView.label.myCourses')}
            data-testid="myCoursesTab"
          />
        )}
        {isAdmin((session?.user as User) || {}) && (
          <Tab
            label={t('ProfileView.label.adminDashboard')}
            data-testid="adminDashboardTab"
          />
        )}
      </Tabs>

      {selectedTab === 0 && (
        <>
          <ProfileCourseList
            headerText={t('ProfileView.header.coursesInprogress')}
            courses={courses.filter(
              (course: Course) =>
                course.startDate <= currentDate && course.endDate >= currentDate
            )}
            open={true}
            id={'inprogressCourses'}
          />
          <ProfileCourseList
            headerText={t('ProfileView.header.upcomingCourses')}
            courses={courses.filter(
              (course: Course) => course.startDate > currentDate
            )}
            open={true}
            timer={true}
            id={'upcomingCourses'}
          />
          <ProfileCourseList
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
            headerText={t('ProfileView.header.upcomingCreatedCourses')}
            courses={createdCourses.filter(
              (createdCourse: Course) => createdCourse.startDate > currentDate
            )}
            open={true}
            timer={true}
            id={'upcomingCreated'}
          />
          <ProfileCourseList
            headerText={t('ProfileView.header.endedCreatedCourses')}
            courses={createdCourses.filter(
              (createdCourse: Course) => createdCourse.endDate < currentDate
            )}
            open={true}
            id={'endedCreated'}
          />
          <ProfileTemplateList
            headerText={
              isAdmin((session?.user as User) || {})
                ? t('ProfileView.header.templatesAdmin')
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
          <UserList users={users} lang="en" />
        </div>
      )}
    </div>
  );
}
