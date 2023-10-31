import { filterCourses } from '@/components/CourseFilter/CourseFilterLogic';

describe('filterCourses function', () => {
  const courses = [
    {
      _count: { students: 10 },
      id: '1',
      name: 'Introduction to Python',
      description: 'Learn Python programming.',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      maxStudents: 20,
      tags: [{ id: 'tag1', name: 'Programming' }],
    },
    {
      _count: { students: 5 },
      id: '2',
      name: 'Web Development Bootcamp',
      description: 'Become a full-stack developer.',
      startDate: new Date('2023-11-12'),
      endDate: new Date('2023-11-28'),
      maxStudents: 15,
      tags: [{ id: 'tag2', name: 'Web Development' }],
    },
  ];

  it('filters courses by a courseName', () => {
    const filtered = filterCourses(courses, { courseName: 'Python' });
    expect(filtered).toEqual([courses[0]]);
  });

  it('filters courses by a courseTag', () => {
    const filtered = filterCourses(courses, { courseTag: 'Programming' });
    expect(filtered).toEqual([courses[0]]);
  });

  it('filters courses by courseDates', () => {
    const filtered = filterCourses(courses, {
      courseDates:
        'Sun Nov 09 2023 00:00:00 GMT+0200 (Eastern European Standard Time)-Thu Nov 29 2023 00:00:00 GMT+0200 (Eastern European Standard Time)',
    });
    expect(filtered).toEqual([courses[1]]);
  });

  it('returns all the courses when a search criterion is not given."', () => {
    const filtered = filterCourses(courses, {});
    expect(filtered).toEqual(courses);
  });
});
