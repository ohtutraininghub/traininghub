import { GET, POST } from './route';
import { prisma } from '@/lib/prisma';

beforeEach(async () => {
  await prisma.course.deleteMany({});
});

const newCourse = {
  name: 'Python',
  description: 'Python fundamentals',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  maxStudents: 20,
};

const startAfterEndCourse = {
  name: 'Failure',
  description: 'Course ends before it has started.',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-20T00:00:00Z',
  maxStudents: 20,
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
      const response = await POST(newCourse as any);
      const data = await response.json();
      expect(data.data.name).toBe('Python');
      expect(response.status).toBe(201);
    });
    it('fails with non-number student amount', async () => {
      const response = await POST(studentsAsStringCourse as any);
      expect(response.status).toBe(500);
    });
    it('fails if end date is prior to start date', async () => {
      const response = await POST(startAfterEndCourse as any);
      expect(response.status).toBe(500);
    });
    it('fails if start date is in the past', async () => {
      const response = await POST(startDateInThePastCourse as any);
      expect(response.status).toBe(500);
    });
  });
});
