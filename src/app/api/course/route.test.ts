import { MessageType } from '@/lib/response/responseUtil';
import { GET, POST } from './route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';

beforeEach(async () => {
  await prisma.course.deleteMany({});
});

const newCourse = {
  name: 'Python',
  description: 'Python fundamentals',
  startDate: '2023-09-27T00:00:00Z',
  endDate: '2023-09-28T00:00:00Z',
  maxStudents: 20,
};

const failedCourse = {
  name: '0/5',
  description: 'maxStudents as a string fails this test',
  startDate: '3114 BC-08-11',
  endDate: '2012 BC-12-21',
  maxStudents: '112',
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
        body: newCourse,
        json: () => newCourse,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Course succesfully created!');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(201);
    });

    it('fails with incorrect inputs', async () => {
      const { req } = createMocks<NextRequest>({
        method: 'POST',
        body: failedCourse,
        json: () => failedCourse,
      });

      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toBe(
        'Invalid date. Invalid date. Expected number, received string.'
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(400);
    });
  });
});
