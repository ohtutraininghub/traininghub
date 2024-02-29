/*
CourseFilterLogic works in conjunction; e.g. if a courseName AND courseTag AND courseDates are all chosen, all courses that meet all the conditions are displayed
to the user. If one of the contidions is not chosen, e.g. courseName being null, courses are filtered by the conjunction of courseTag AND courseDates etc.
*/

import { CourseWithInfo } from '@/lib/prisma/courses';

export function filterCourses(
  courses: CourseWithInfo[],
  searchCourses: {
    courseName?: string | undefined;
    courseTag?: string | undefined;
    startDate?: string;
    endDate?: string;
  },
  showPastCourses: boolean
) {
  let filteredCourses = [...courses];

  if (showPastCourses) {
    filteredCourses = filteredCourses.filter(
      (course) => new Date(course.endDate) < new Date()
    );
  } else {
    filteredCourses = filteredCourses.filter(
      (course) => new Date(course.endDate) >= new Date()
    );
  }

  if (searchCourses?.courseName) {
    const searchName = searchCourses.courseName.toLowerCase();
    filteredCourses = filteredCourses.filter((course) =>
      course.name.toLowerCase().includes(searchName)
    );
  }

  if (searchCourses?.courseTag) {
    const tags = searchCourses.courseTag.toLowerCase().split(',');
    filteredCourses = filteredCourses.filter((course) =>
      course.tags.some((tag: { name: string }) =>
        tags.includes(tag.name.toLowerCase())
      )
    );
  }

  if (searchCourses.startDate || searchCourses.endDate) {
    const startDate = searchCourses.startDate
      ? new Date(searchCourses.startDate)
      : undefined;
    const endDate = searchCourses.endDate
      ? new Date(searchCourses.endDate)
      : undefined;

    startDate?.setDate(startDate.getDate() + 1);
    endDate?.setDate(endDate.getDate() + 1);
    startDate?.setUTCHours(0, 0, 0, 0);
    endDate?.setUTCHours(0, 0, 0, 0);

    filteredCourses = filteredCourses.filter((course) => {
      if (startDate && endDate) {
        return (
          startDate <= new Date(course.startDate.setUTCHours(0, 0, 0, 0)) &&
          new Date(course.endDate.setUTCHours(0, 0, 0, 0)) <= endDate
        );
      }
      if (startDate) {
        return startDate <= new Date(course.startDate.setUTCHours(0, 0, 0, 0));
      }
      if (endDate) {
        return new Date(course.endDate.setUTCHours(0, 0, 0, 0)) <= endDate;
      }
    });
  }

  return filteredCourses;
}
