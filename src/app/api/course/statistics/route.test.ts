import { GET } from './route';
import { prisma, clearDatabase } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { Role } from '@prisma/client';
import { getServerAuthSession } from '@/lib/auth';

const adminUser = {
  id: 'clo079ls3000108jsbdbsc8pv',
  role: Role.ADMIN,
};

const trainerUser = {
  id: 'cls31nwpr000308jycjsj3em1',
  role: Role.TRAINER,
};

const traineeUser = {
  id: 'cls1rqioq000008jlf156ate0',
  role: Role.TRAINEE,
};

jest.mock('../../../../lib/auth', () => ({
  getServerAuthSession: jest.fn(),
}));

const mockGetRequest = () => {
  return createMocks<NextRequest>({
    method: 'GET',
    nextUrl: {
      searchParams: new URLSearchParams(
        'fromDate=2100-09-10T00:00:00Z&toDate=2100-09-20T23:59:59Z'
      ),
    },
  }).req;
};

const startsBeforeEndsWithin = {
  createdById: adminUser.id,
  name: 'Python',
  description: 'Python fundamentals',
  startDate: '2100-09-05T00:00:00Z',
  endDate: '2100-09-15T00:00:00Z',
  maxStudents: 20,
};
const startsWithinEndsAfter = {
  createdById: adminUser.id,
  name: 'C++',
  description: 'C++ fundamentals',
  startDate: '2100-09-15T00:00:00Z',
  endDate: '2100-09-25T00:00:00Z',
  maxStudents: 20,
};
const startsWithinEndsWithin = {
  createdById: adminUser.id,
  name: 'Java',
  description: 'Java fundamentals',
  startDate: '2100-09-15T00:00:00Z',
  endDate: '2100-09-19T00:00:00Z',
  maxStudents: 20,
};
const startsBeforeEndsAfter = {
  createdById: adminUser.id,
  name: 'Ruby',
  description: 'Ruby fundamentals',
  startDate: '2100-09-05T00:00:00Z',
  endDate: '2100-09-25T00:00:00Z',
  maxStudents: 20,
};
const startsBeforeEndsBefore = {
  createdById: adminUser.id,
  name: 'JavaScript',
  description: 'Ruby fundamentals',
  startDate: '2100-09-05T00:00:00Z',
  endDate: '2100-09-25T00:00:00Z',
  maxStudents: 20,
};
const startsAfterEndsAfter = {
  createdById: adminUser.id,
  name: 'TypeScript',
  description: 'Ruby fundamentals',
  startDate: '2100-09-05T00:00:00Z',
  endDate: '2100-09-25T00:00:00Z',
  maxStudents: 20,
};

beforeEach(async () => {
  await clearDatabase();
  await prisma.user.createMany({
    data: [adminUser, trainerUser, traineeUser],
  });
  await prisma.course.createMany({
    data: [
      startsBeforeEndsWithin,
      startsWithinEndsAfter,
      startsWithinEndsWithin,
      startsBeforeEndsAfter,
    ],
  });
});

const authenticateAsAdmin = async () => {
  (getServerAuthSession as jest.Mock).mockImplementation(async () =>
    Promise.resolve({
      user: adminUser,
    })
  );
};

const authenticateAsTrainer = async () => {
  (getServerAuthSession as jest.Mock).mockImplementation(async () =>
    Promise.resolve({
      user: trainerUser,
    })
  );
};

const authenticateAsTrainee = async () => {
  (getServerAuthSession as jest.Mock).mockImplementation(async () =>
    Promise.resolve({
      user: traineeUser,
    })
  );
};

describe('Course Statistics API tests', () => {
  describe('GET', () => {
    it('should fail as a trainee', async () => {
      authenticateAsTrainee();
      const response = await GET(mockGetRequest());
      expect(response.status).toBe(403);
    });
    it('should fail as a trainer', async () => {
      authenticateAsTrainer();
      const response = await GET(mockGetRequest());
      expect(response.status).toBe(403);
    });
    it('should return courses that start before and ends within the search frame', async () => {
      authenticateAsAdmin();
      const response = await GET(mockGetRequest());
      const data = await response.json();
      expect(data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: startsBeforeEndsWithin.name }),
        ])
      );
      expect(response.status).toBe(200);
    });
    it('should return courses that start within and ends after the search frame', async () => {
      authenticateAsAdmin();
      const response = await GET(mockGetRequest());
      const data = await response.json();
      expect(data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: startsWithinEndsAfter.name }),
        ])
      );
      expect(response.status).toBe(200);
    });
    it('should return courses that start within and ends within the search frame', async () => {
      authenticateAsAdmin();
      const response = await GET(mockGetRequest());
      const data = await response.json();
      expect(data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: startsWithinEndsWithin.name }),
        ])
      );
      expect(response.status).toBe(200);
    });
    it('should return courses that start before and ends after the search frame', async () => {
      authenticateAsAdmin();
      const response = await GET(mockGetRequest());
      const data = await response.json();
      expect(data.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: startsBeforeEndsAfter.name }),
        ])
      );
      expect(response.status).toBe(200);
    });
    it('should not return courses that start before and ends before the search frame', async () => {
      authenticateAsAdmin();
      const response = await GET(mockGetRequest());
      const data = await response.json();
      expect(data.data).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: startsBeforeEndsBefore.name }),
        ])
      );
      expect(response.status).toBe(200);
    });
    it('should not return courses that start after and ends after the search frame', async () => {
      authenticateAsAdmin();
      const response = await GET(mockGetRequest());
      const data = await response.json();
      expect(data.data).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: startsAfterEndsAfter.name }),
        ])
      );
      expect(response.status).toBe(200);
    });
  });
});
