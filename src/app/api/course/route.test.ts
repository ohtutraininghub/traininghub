import { MessageType } from '@/lib/response/responseUtil';
import { GET, POST, PUT } from './route';
import { prisma } from '@/lib/prisma/prisma';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';

beforeEach(async () => {
  await prisma.course.deleteMany({});
});

const newCourse = {
  name: 'Python',
  description: 'Python fundamentals',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  maxStudents: 20,
  tags: [],
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
};

const startDateInThePastCourse = {
  name: 'Failure',
  description: 'Start date in 1900s fails the test',
  startDate: '1900-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  maxStudents: 20,
};

const getTableLength = async () => {
  const allCourses = await prisma.course.findMany();
  return allCourses.length;
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
      const { req } = createMocks<NextRequest>({
        method: 'POST',
        json: () => newCourse,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Course succesfully created!');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(201);
      expect(await getTableLength()).toBe(1);
    });

    it('fails with incorrect inputs', async () => {
      const { req } = createMocks<NextRequest>({
        method: 'POST',
        json: () => studentsAsStringCourse,
      });

      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toContain('Expected number, received string.');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(400);
    });
    it('fails if end date is prior to start date', async () => {
      const response = await POST(startAfterEndCourse as any);
      const data = await response.json();
      expect(data.message).toContain(
        'The end date cannot be before the start date'
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(await getTableLength()).toBe(0);
      expect(response.status).toBe(400);
    });
    it('fails if start date is in the past', async () => {
      const response = await POST(startDateInThePastCourse as any);
      const data = await response.json();
      expect(data.message).toContain('Start date cannot be in the past');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(await getTableLength()).toBe(0);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT', () => {
    const courseData = {
      id: '1337',
      name: 'Spaghetti coding 101',
      description: 'Security by obscurity',
      endDate: new Date().toString(),
      startDate: new Date().toString(),
      maxStudents: 200,
    };

    it('Should return 404 when course does not exist in the db', async () => {
      const { req } = createMocks<NextRequest>({
        method: 'PUT',
        json: () => courseData,
      });

      const response = await PUT(req);
      const data = await response.json();
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(404);
    });
  });
});
