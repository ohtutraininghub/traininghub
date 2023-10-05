import { Course } from '@prisma/client';

export const getCourseDateString = (course: Course) => {
  const startDateString = course.startDate.toDateString();
  const endDateString = course.endDate.toDateString();
  return startDateString === endDateString
    ? startDateString
    : `${startDateString} - ${endDateString}`;
};
