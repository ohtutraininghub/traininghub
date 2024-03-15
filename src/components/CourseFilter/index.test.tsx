import { filterCourses } from '@/components/CourseFilter/CourseFilterLogic';
import { CourseWithInfo } from '@/lib/prisma/courses';

describe('filterCourses function', () => {
  const courses: CourseWithInfo[] = [
    {
      _count: {
        students: 10,
        requesters: 5,
      },
      createdBy: {
        name: '',
      },
      summary: '',
      id: '1',
      name: 'Introduction to Python',
      description: 'Learn Python programming.',
      startDate: new Date('2030-01-01'),
      endDate: new Date('2030-01-31'),
      lastEnrollDate: null,
      lastCancelDate: null,
      createdById: '1234321',
      maxStudents: 20,
      tags: [{ id: 'tag1', name: 'Programming' }],
      image: '',
    },
    {
      _count: {
        students: 5,
        requesters: 0,
      },
      createdBy: {
        name: '',
      },
      summary: '',
      id: '2',
      name: 'Web Development Bootcamp',
      description: 'Become a full-stack developer.',
      startDate: new Date('2029-11-12'),
      endDate: new Date('2029-11-28'),
      lastEnrollDate: null,
      lastCancelDate: null,
      createdById: '123432132',
      maxStudents: 15,
      tags: [{ id: 'tag2', name: 'Web Development' }],
      image: '',
    },
  ];

  it('filters courses by a courseName', () => {
    const filtered = filterCourses(courses, { courseName: 'Python' }, false);
    expect(filtered).toEqual([courses[0]]);
  });

  it('filters courses by a courseTag', () => {
    const filtered = filterCourses(
      courses,
      { courseTag: 'Programming' },
      false
    );
    expect(filtered).toEqual([courses[0]]);
  });

  it('filters courses by startDate', () => {
    const filtered = filterCourses(
      courses,
      {
        startDate:
          'Thu Nov 15 2029 00:00:00 GMT+0200 (Eastern European Standard Time)',
      },
      false
    );
    expect(filtered).toEqual([courses[0]]);
  });

  it('filters courses by endDate', () => {
    const filtered = filterCourses(
      courses,
      {
        endDate:
          'Thu Nov 29 2029 00:00:00 GMT+0200 (Eastern European Standard Time)',
      },
      false
    );
    expect(filtered).toEqual([courses[1]]);
  });

  it('returns all the courses when a search criterion is not given."', () => {
    const filtered = filterCourses(courses, {}, false);
    expect(filtered).toEqual(courses);
  });
});
