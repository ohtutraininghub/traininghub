import { getServerAuthSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { prisma, clearDatabase } from '@/lib/prisma';
import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';
import { POST } from './route';

const traineeUser = {
  id: 'cls1rqioq000008jlf156ate0',
  role: Role.TRAINEE,
};

const trainerUser = {
  id: 'cls6jt0ck000k08lfdsrq9hll',
  role: Role.TRAINER,
};

const courseDataWithDate = {
  id: 'cloh5jr6h000008l40614d1vr',
  name: 'Spaghetti coding 101',
  description: 'Security by obscurity',
  startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
  lastEnrollDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
  lastCancelDate: new Date(Date.now() + 1000 * 60 * 60 * 12),
  maxStudents: 200,
  createdById: trainerUser.id,
  tags: [],
};

jest.mock('../../../../lib/auth', () => ({
  getServerAuthSession: jest.fn(),
}));

beforeEach(async () => {
  await clearDatabase();
  await prisma.user.createMany({
    data: [traineeUser, trainerUser],
  });
});

const mockPostRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'POST',
    json: () => body,
  }).req;
};

describe('Slack channel API tests', () => {
  describe('POST', () => {
    it('Forbidden if user is a trainee', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: traineeUser,
        })
      );

      const courseInDb = await prisma.course.create({
        data: {
          ...courseDataWithDate,
          tags: {
            connect: [],
          },
        },
      });

      const req = mockPostRequest({ courseId: courseInDb?.id });
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toBe('Forbidden');
      expect(data.messageType).toBe('error');
    });

    it('Fails if course not in db', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: trainerUser,
        })
      );

      const req = mockPostRequest({ courseId: 'cloh5jr6h000008l40614d1vr' });
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toBe('Course by the given id was not found!');
      expect(data.messageType).toBe('error');
    });

    it('Fails if course already has a slack channel', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: trainerUser,
        })
      );

      const courseInDb = await prisma.course.create({
        data: {
          ...courseDataWithDate,
          slackChannelId: '123456',
          tags: {
            connect: [],
          },
        },
      });

      const req = mockPostRequest({ courseId: courseInDb?.id });
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toBe('Channel already exists');
      expect(data.messageType).toBe('error');
    });
  });
});
