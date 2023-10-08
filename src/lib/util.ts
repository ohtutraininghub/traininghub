import { CourseWithStudentCount } from './prisma/courses';

export const getCourseDateString = (course: CourseWithStudentCount) => {
  const startDateString = course.startDate.toDateString();
  const endDateString = course.endDate.toDateString();
  return startDateString === endDateString
    ? startDateString
    : `${startDateString} - ${endDateString}`;
};
