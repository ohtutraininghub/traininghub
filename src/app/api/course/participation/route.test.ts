import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';
import { MessageType, StatusCodeType } from '@/lib/response/responseUtil';
import { clearDatabase } from '@/lib/prisma';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';
import { Role } from '@prisma/client';
import { POST, DELETE } from './route';

const testUser = {
  id: 'cloeouh4x0000qiexq8tqzvh7',
};

const trainerUser = {
  id: 'cls31nwpr000308jycjsj3em1',
  role: Role.TRAINER,
};

const traineeUser = {
  id: 'cls1rqioq000008jlf156ate0',
  role: Role.TRAINEE,
};

const testCourse = {
  id: 'cloeouh4x0000qiexq8tqzvh8',
  name: 'Git Fundamentals',
  description:
    'This course will walk you through the fundamentals of using Git for version control. You will learn how to create a local Git repository, commit files and push your changes to a remote repository. The course will introduce you to concepts like the working copy and the staging area and teach you how to organise you repository using tags and branches. You will learn how to make pull requests and merge branches, and tackle merge conflicts when they arise.',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-02T00:00:00Z',
  maxStudents: 3,
  createdById: testUser.id,
};

jest.mock('../../../../lib/auth', () => ({
  getServerAuthSession: jest.fn(),
}));

const authTrainer = () => {
  (getServerAuthSession as jest.Mock).mockImplementation(async () =>
    Promise.resolve({
      user: trainerUser,
    })
  );
};

const authTrainee = () => {
  (getServerAuthSession as jest.Mock).mockImplementation(async () =>
    Promise.resolve({
      user: traineeUser,
    })
  );
};

const mockPostRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'POST',
    json: () => body,
  }).req;
};

const mockDeleteRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'DELETE',
    json: () => body,
  }).req;
};

beforeEach(async () => {
  await clearDatabase();
  await prisma.user.create({
    data: { id: testUser.id },
  });
  await prisma.course.create({
    data: testCourse,
  });
});

describe('Course participation API tests', () => {
  describe('POST', () => {
    it('trainer can mark participation for valid user on valid course', async () => {
      authTrainer();

      const req = mockPostRequest({
        courseId: testCourse.id,
        userId: testUser.id,
      });
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Participation marked');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.CREATED);
    });

    it('trainee cannot mark participations', async () => {
      authTrainee();

      const req = mockPostRequest({
        courseId: testCourse.id,
        userId: testUser.id,
      });
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Forbidden');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.FORBIDDEN);
    });
  });

  describe('DELETE', () => {
    it('trainer can delete participations with valid data', async () => {
      authTrainer();

      await prisma.participation.create({
        data: {
          userId: testUser.id,
          courseId: testCourse.id,
        },
      });

      const req = mockDeleteRequest({
        courseId: testCourse.id,
        userId: testUser.id,
      });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toBe('Participation removed');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.OK);
    });

    it('trainee cannot delete participations', async () => {
      authTrainee();

      await prisma.participation.create({
        data: {
          userId: testUser.id,
          courseId: testCourse.id,
        },
      });

      const req = mockDeleteRequest({
        courseId: testCourse.id,
        userId: testUser.id,
      });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toBe('Forbidden');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.FORBIDDEN);
    });
  });
});
