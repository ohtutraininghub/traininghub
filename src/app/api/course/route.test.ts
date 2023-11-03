import { MessageType } from '@/lib/response/responseUtil';
import { GET, POST, PUT } from './route';
import { prisma, clearDatabase } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';

beforeEach(async () => {
  await clearDatabase();
});

const newCourse = {
  name: 'Python',
  description: 'Python fundamentals',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  maxStudents: 20,
  tags: [],
};

const newCourseWithTags = {
  name: 'Testing with Jest',
  description: 'Third tag does not exist and relation should not be formed',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  maxStudents: 50,
  tags: ['Unit Testing', 'Jest', 'I do not exist'],
};

const startAfterEndCourse = {
  name: 'Failure',
  description: 'Course ends before it has started.',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-20T00:00:00Z',
  maxStudents: 20,
  tags: [],
};

const studentsAsStringCourse = {
  name: '0/5',
  description: 'maxStudents as a string fails this test',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  maxStudents: '112',
  tags: [],
};

const startDateInThePastCourse = {
  name: 'Failure',
  description: 'Start date in 1900s fails the test',
  startDate: '1900-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  maxStudents: 20,
  tags: [],
};

const getTableLength = async () => {
  const allCourses = await prisma.course.findMany();
  return allCourses.length;
};

const mockPostRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'POST',
    json: () => body,
  }).req;
};

const mockUpdateRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'PUT',
    json: () => body,
  }).req;
};

describe('API', () => {
  describe('GET', () => {
    it('returns an empty list from the database at the beginning of the tests', async () => {
      const response = await GET();
      const data = await response.json();
      expect(data.data.length).toBe(0);
      expect(response.status).toBe(200);
    });
  });

  describe('POST', () => {
    it('adds new course in to the database', async () => {
      const req = mockPostRequest(newCourse);
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Course successfully created!');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(201);
      const tblLength = await getTableLength();
      expect(tblLength).toBe(1);
    });

    it('adds new course only with existing tags to the db', async () => {
      await prisma.tag.createMany({
        data: [{ name: 'Unit Testing' }, { name: 'Jest' }],
      });
      const req = mockPostRequest(newCourseWithTags);
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toBe('Course successfully created!');

      const courseInDb = await prisma.course.findFirst({
        include: { tags: true },
      });

      expect(courseInDb).not.toBeNull();
      expect(courseInDb).toBeDefined();

      if (courseInDb) {
        courseInDb.tags.map((tag) => {
          expect(['Unit Testing', 'Jest']).toContain(tag.name);
        });
      }
    });

    it('fails with incorrect inputs', async () => {
      const req = mockPostRequest(studentsAsStringCourse);
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toContain('Expected number, received string.');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(400);
    });

    it('fails if end date is prior to start date', async () => {
      const req = mockPostRequest(startAfterEndCourse);
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toContain(
        'The end date cannot be before the start date'
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      const tblLength = await getTableLength();
      expect(tblLength).toBe(0);
      expect(response.status).toBe(400);
    });

    it('fails if start date is in the past', async () => {
      const req = mockPostRequest(startDateInThePastCourse);
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toContain('Start date cannot be in the past');
      expect(data.messageType).toBe(MessageType.ERROR);
      const tblLength = await getTableLength();
      expect(tblLength).toBe(0);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT', () => {
    const courseDataWithDate = {
      id: 'cloh5jr6h000008l40614d1vr',
      name: 'Spaghetti coding 101',
      description: 'Security by obscurity',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      maxStudents: 200,
      tags: [],
    };

    const courseData = {
      ...courseDataWithDate,
      startDate: courseDataWithDate.startDate.toString(),
      endDate: courseDataWithDate.endDate.toString(),
    };

    it('Should return 404 when course does not exist in the db', async () => {
      const req = mockUpdateRequest(courseData);

      const response = await PUT(req);
      const data = await response.json();
      expect(data.message).toContain('Course not found');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(404);
    });

    it('Updates course details accordingly', async () => {
      await prisma.tag.createMany({
        data: [{ name: 'Unit Testing' }, { name: 'Jest' }],
      });

      await prisma.course.create({
        data: {
          ...courseDataWithDate,
          tags: {
            connect: [],
          },
        },
      });

      const courseInDb = await prisma.course.findFirst({
        include: { tags: true },
      });

      const updatedCourse = {
        ...courseData,
        maxStudents: 30,
        startDate: courseData.startDate,
        endDate: courseData.endDate,
        tags: ['Unit Testing', 'Jest'],
        id: courseInDb?.id || null,
      };

      const req = mockUpdateRequest(updatedCourse);
      const response = await PUT(req);
      const data = await response.json();
      expect(data.message).toBe('Course successfully updated!');
      expect(data.messageType).toBe(MessageType.SUCCESS);

      const updatedCourseInDb = await prisma.course.findFirst({
        include: { tags: true },
      });
      if (!updatedCourseInDb) throw Error;

      expect(updatedCourseInDb.maxStudents).toBe(30);
      updatedCourseInDb.tags.map((e) => {
        expect(['Unit Testing', 'Jest']).toContain(e.name);
      });
    });
  });
});
