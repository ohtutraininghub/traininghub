import { MessageType, StatusCodeType } from '@/lib/response/responseUtil';
import { POST, PUT } from './route';
import { clearDatabase, prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';

const testUser = {
  id: 'cloeouh4x0000qiexq8tqzvh7',
};

const newCourse = {
  name: 'Git Fundamentals',
  description:
    'This course will walk you through the fundamentals of using Git for version control. You will learn how to create a local Git repository, commit files and push your changes to a remote repository. The course will introduce you to concepts like the working copy and the staging area and teach you how to organise you repository using tags and branches. You will learn how to make pull requests and merge branches, and tackle merge conflicts when they arise.',
  startDate: '2100-01-01T00:00:00Z',
  endDate: '2100-01-02T00:00:00Z',
  maxStudents: 3,
  createdById: testUser.id,
};

const dateYesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
const dateTomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
const dateTomorrowEvening = new Date(Date.now() + 32 * 60 * 60 * 1000);

const pastDeadlineToEnrollCourse = {
  name: 'Git Fundamentals',
  description:
    'This course will walk you through the fundamentals of using Git for version control. You will learn how to create a local Git repository, commit files and push your changes to a remote repository. The course will introduce you to concepts like the working copy and the staging area and teach you how to organise you repository using tags and branches. You will learn how to make pull requests and merge branches, and tackle merge conflicts when they arise.',
  startDate: dateYesterday,
  endDate: dateTomorrow,
  lastEnrollDate: dateYesterday,
  maxStudents: 8,
  createdById: testUser.id,
};

const pastDeadlineToCancelCourse = {
  name: 'Git Fundamentals',
  description:
    'This course will walk you through the fundamentals of using Git for version control. You will learn how to create a local Git repository, commit files and push your changes to a remote repository. The course will introduce you to concepts like the working copy and the staging area and teach you how to organise you repository using tags and branches. You will learn how to make pull requests and merge branches, and tackle merge conflicts when they arise.',
  startDate: dateTomorrow,
  endDate: dateTomorrowEvening,
  lastEnrollDate: dateYesterday,
  lastCancelDate: dateYesterday,
  maxStudents: 8,
  createdById: testUser.id,
};

const invalidCourseId = '123';

beforeEach(async () => {
  await clearDatabase();
  await prisma.user.create({
    data: { id: testUser.id },
  });
});

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
    method: 'POST',
    json: () => body,
  }).req;
};

describe('Course enrollment API tests', () => {
  describe('POST', () => {
    it('enrolling in a course with valid user id and course id succeeds', async () => {
      const existingCourse = await prisma.course.create({
        data: newCourse,
      });

      const req = mockPostRequest({ courseId: existingCourse.id });
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Enrolled succesfully!');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.CREATED);
    });

    it('enrolling in a course that does not exist throws error', async () => {
      const req = mockPostRequest({ courseId: invalidCourseId });
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Course by the given id was not found!');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.NOT_FOUND);
    });

    it('enrolling in a course that is full returns error message', async () => {
      const fullyBookedCourse = await prisma.course.create({
        data: {
          ...newCourse,
          students: {
            connectOrCreate: [
              {
                where: { id: 'cloevyal500003b6qp3ltvx4d' },
                create: { id: 'cloevyal500003b6qp3ltvx4d' },
              },
              {
                where: { id: 'cloevyp0i00003b6qyjxhae89' },
                create: { id: 'cloevyp0i00003b6qyjxhae89' },
              },
              {
                where: { id: 'cloevz24z00003b6q15vsze29' },
                create: { id: 'cloevz24z00003b6q15vsze29' },
              },
            ],
          },
        },
      });

      const req = mockPostRequest({ courseId: fullyBookedCourse.id });
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Course is already full!');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });

    it('trying to enroll after enrollment deadline is not possible', async () => {
      const existingCourse = await prisma.course.create({
        data: pastDeadlineToEnrollCourse,
      });

      const req = mockPostRequest({ courseId: existingCourse.id });
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe(
        'No enrolling allowed after enrollment deadline'
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });

    it('enrolling in a course already signed up for returns error message', async () => {
      const alreadyEnrolledCourse = await prisma.course.create({
        data: {
          ...newCourse,
          students: {
            connect: [{ id: testUser.id }],
          },
        },
      });

      const req = mockPostRequest({ courseId: alreadyEnrolledCourse.id });
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('You have already enrolled!');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });

  describe('PUT', () => {
    it('cancelling enrollment in a course one was signed up for succeeds', async () => {
      const enrolledCourse = await prisma.course.create({
        data: {
          ...newCourse,
          students: {
            connect: [{ id: testUser.id }],
          },
        },
      });

      const req = mockUpdateRequest({ courseId: enrolledCourse.id });
      const response = await PUT(req);
      const data = await response.json();

      expect(data.message).toBe('Your enrollment was canceled');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.OK);
    });

    it('cancelling enrollment in a course one was not signed up for throws error', async () => {
      const notEnrolledCourse = await prisma.course.create({
        data: {
          ...newCourse,
          students: {
            connect: [],
          },
        },
      });

      const req = mockUpdateRequest({ courseId: notEnrolledCourse.id });
      const response = await PUT(req);
      const data = await response.json();

      expect(data.message).toBe('You have not enrolled to this course');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });

    it('cancelling enrollment after cancellation deadline is not possible', async () => {
      const enrolledCourse = await prisma.course.create({
        data: {
          ...pastDeadlineToCancelCourse,
          students: {
            connect: [{ id: testUser.id }],
          },
        },
      });

      const req = mockUpdateRequest({ courseId: enrolledCourse.id });
      const response = await PUT(req);
      const data = await response.json();

      expect(data.message).toBe(
        'No cancelling allowed after cancellation deadline'
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });
});
