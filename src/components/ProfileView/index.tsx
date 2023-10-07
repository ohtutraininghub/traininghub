'use client';

import ProfileUserDetails from '@/components/ProfileView/ProfileUserDetails';
import ProfileCourseList from '@/components/ProfileView/ProfileCourseList';
import { Course } from '@prisma/client';

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
  const currentDate = new Date();

  const endedCourses = courses.filter(
    (course: Course) => course.endDate < currentDate
  );

  const inProgressCourses = courses.filter(
    (course: Course) =>
      course.startDate <= currentDate && course.endDate >= currentDate
  );

  const upcomingCourses = courses.filter(
    (course: Course) => course.startDate > currentDate
  );

  return (
    <>
      <ProfileUserDetails
        name={userDetails.name}
        email={userDetails.email}
        image={userDetails.image}
      />
      <ProfileCourseList
        headerText="Courses in progress"
        courses={inProgressCourses}
        open={true}
      />
      <ProfileCourseList
        headerText="Upcoming courses"
        courses={upcomingCourses}
        open={true}
      />
      <ProfileCourseList
        headerText="Ended courses"
        courses={endedCourses}
        open={false}
      />
    </>
  );
}
