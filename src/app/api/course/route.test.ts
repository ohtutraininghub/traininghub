import { GET, POST, DELETE, PUT } from './route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

describe('API', () => {
  describe('GET', () => {
    it('returns all the courses from the database', async () => {
      const response = await GET();
      expect(response.status).toBe(200);
    });
  });

  describe('POST', () => {
    it('adds new course in to the database', async () => {
      const response = await POST(newCourse);
      expect(response.status).toBe(201);
    });
  });

  describe('PUT', () => {});

  describe('DEL', () => {});
});
