import { CourseWithTagsAndStudentCount } from './prisma/courses';

export const getCourseDateString = (course: CourseWithTagsAndStudentCount) => {
  const startDateString = course.startDate.toDateString();
  const endDateString = course.endDate.toDateString();
  return startDateString === endDateString
    ? startDateString
    : `${startDateString} - ${endDateString}`;
};
