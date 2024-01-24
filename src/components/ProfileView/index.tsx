'use client';

import ProfileUserDetails from '@/components/ProfileView/ProfileUserDetails';
import ProfileCourseList from '@/components/ProfileView/ProfileCourseList';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Course, Role, User } from '@prisma/client';
import { PropsWithChildren, SyntheticEvent, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import UserList from '@/components/UserList';

export interface userDetails {
  name: string;
  email: string;
  image: string;
}

export interface ProfileViewProps extends PropsWithChildren {
  userDetails: userDetails;
  courses: Course[];
  users: User[];
}

export default function ProfileView({
  userDetails,
  courses,
  users,
  children,
}: ProfileViewProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const { palette } = useTheme();
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
        <Tab label="My courses" />
        <Tab label="Additional information" />
        {session?.user.role === Role.ADMIN && <Tab label="Admin dashboard" />}
      </Tabs>

      {selectedTab === 0 && (
        <>
          <ProfileCourseList
            headerText="Courses in progress"
            courses={courses.filter(
              (course: Course) =>
                course.startDate <= currentDate && course.endDate >= currentDate
            )}
            open={true}
          />
          <ProfileCourseList
            headerText="Upcoming courses"
            courses={courses.filter(
              (course: Course) => course.startDate > currentDate
            )}
            open={true}
            timer={true}
          />
          <ProfileCourseList
            headerText="Ended courses"
            courses={courses.filter(
              (course: Course) => course.endDate < currentDate
            )}
            open={false}
          />
          <ProfileCourseList
            headerText="My course templates"
            courses={courses.filter(
              (course: Course) => course.startDate > currentDate
            )}
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
