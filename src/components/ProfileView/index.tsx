'use client';

import ProfileUserDetails from '@/components/ProfileView/ProfileUserDetails';
import ProfileCourseList from '@/components/ProfileView/ProfileCourseList';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Course } from '@prisma/client';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

export interface userDetails {
  name: string;
  email: string;
  image: string;
}

export interface ProfileViewProps {
  userDetails: userDetails;
  courses: Course[];
}

export default function ProfileView({
  userDetails,
  courses,
}: ProfileViewProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const { palette } = useTheme();
  const currentDate = new Date();

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
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
            color: `${palette.darkBlue.main} !important`,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: palette.darkBlue.main,
          },
        }}
      >
        <Tab label="My courses" />
        <Tab label="Additional information" />
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
          />
          <ProfileCourseList
            headerText="Ended courses"
            courses={courses.filter(
              (course: Course) => course.endDate < currentDate
            )}
            open={false}
          />
        </>
      )}
    </div>
  );
}
