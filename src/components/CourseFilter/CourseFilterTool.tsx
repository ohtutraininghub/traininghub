export function filterCourses(
  courses: ({
    _count: { students: number };
    tags: { id: string; name: string }[];
  } & {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    maxStudents: number;
  })[],
  searchCourses: {
    courseName?: string | undefined;
    courseTag?: string | undefined;
    courseDates?: string | undefined;
  }
) {
  let filteredCourses = [...courses];

  if (searchCourses?.courseName) {
    const searchName = searchCourses.courseName.toLowerCase();
    filteredCourses = filteredCourses.filter((course) =>
      course.name.toLowerCase().includes(searchName)
    );
  }

  if (searchCourses?.courseTag) {
    const searchTag = searchCourses.courseTag.toLowerCase();
    filteredCourses = filteredCourses.filter((course) =>
      course.tags.some((tag: { name: string }) =>
        tag.name.toLowerCase().includes(searchTag)
      )
    );
  }
  if (searchCourses?.courseDates) {
    const [start, end] = searchCourses.courseDates.split('-');
    const startDate = new Date(start);
    const endDate = new Date(end);
    filteredCourses = filteredCourses.filter(
      (course) =>
        startDate <= new Date(course.startDate) &&
        new Date(course.endDate) <= endDate
    );
  }
  if (
    searchCourses.courseDates === null ||
    ('' && searchCourses.courseName === null) ||
    ('' && searchCourses.courseTag == null) ||
    ''
  ) {
    return filteredCourses;
  }

  return filteredCourses;
}
