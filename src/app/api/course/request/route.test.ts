import { MessageType, StatusCodeType } from '@/lib/response/responseUtil';
import { POST } from './route';
import { clearDatabase, prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';

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

const invalidCourseId = '123';

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
  });
});
