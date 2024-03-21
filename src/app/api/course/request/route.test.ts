import { MessageType, StatusCodeType } from '@/lib/response/responseUtil';
import { POST, DELETE } from './route';
import { clearDatabase, prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { courseEnrollSchema } from '@/lib/zod/courses';

const testUser = {
  id: 'cloeouh4x0000qiexq8tqzvh7',
};

const testCourse = {
  name: 'Git Fundamentals',
  description:
    'This course will walk you through the fundamentals of using Git for version control. You will learn how to create a local Git repository, commit files and push your changes to a remote repository. The course will introduce you to concepts like the working copy and the staging area and teach you how to organise you repository using tags and branches. You will learn how to make pull requests and merge branches, and tackle merge conflicts when they arise.',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-02T00:00:00Z',
  maxStudents: 3,
  createdById: testUser.id,
};

const invalidCourseId = 'clt716x04000008l2cuggdblf';

jest.mock('../../../../lib/auth', () => ({
  getServerAuthSession: async () =>
    Promise.resolve({
      user: {
        id: testUser.id,
      },
    }),
}));

const mockPostRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'POST',
    json: () => body,
  }).req;
};

const mockUpdateRequest = (body: any) => {
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
});

describe('Course request API tests', () => {
  describe('POST', () => {
    it('requesting a course with valid user id and course id succeeds', async () => {
      const newCourse = await prisma.course.create({
        data: testCourse,
      });

      const req = mockPostRequest({ courseId: newCourse.id });
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Request successfully sent!');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.CREATED);
    });

    it('requesting a course that does not exist throws error', async () => {
      const req = mockPostRequest({ courseId: invalidCourseId });
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Course by the given id was not found!');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.NOT_FOUND);
    });
    it('requesting a course already requested for returns error message', async () => {
      const alreadyEnrolledCourse = await prisma.course.create({
        data: testCourse,
      });

      await prisma.request.create({
        data: {
          user: {
            connect: {
              id: testUser.id,
            },
          },
          course: {
            connect: {
              id: alreadyEnrolledCourse.id,
            },
          },
          date: new Date(),
        },
      });

      const req = mockPostRequest({ courseId: alreadyEnrolledCourse.id });
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('You have already requested!');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });
  describe('DELETE', () => {
    it('removing request from a requested course succeeds', async () => {
      const requestedCourse = await prisma.course.create({
        data: testCourse,
      });

      await prisma.request.create({
        data: {
          user: {
            connect: {
              id: testUser.id,
            },
          },
          course: {
            connect: {
              id: requestedCourse.id,
            },
          },
          date: new Date(),
        },
      });

      const req = mockUpdateRequest({ courseId: requestedCourse.id });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toBe('Your request was removed');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.OK);
    });

    it('removing request from a course not requested throws error', async () => {
      const notRequestedCourse = await prisma.course.create({
        data: testCourse,
      });

      const req = mockUpdateRequest({ courseId: notRequestedCourse.id });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toBe('You have not requested this course');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });
});
