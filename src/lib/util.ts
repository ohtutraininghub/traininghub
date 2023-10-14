import { CourseWithTagsAndStudentCount } from './prisma/courses';

export const getCourseDateString = (course: CourseWithTagsAndStudentCount) => {
  const startDateString = course.startDate.toDateString();
  const endDateString = course.endDate.toDateString();
  return startDateString === endDateString
    ? startDateString
    : `${startDateString} - ${endDateString}`;
};

// https://stackoverflow.com/a/66558369
export const dateToDateTimeLocal = (date: Date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, -1);
};
