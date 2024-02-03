import { MessageType, StatusCodeType } from '@/lib/response/responseUtil';
import { GET, POST, PUT, DELETE } from './route';
import { prisma, clearDatabase } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { Role } from '@prisma/client';
import { getServerAuthSession } from '@/lib/auth';

const adminUser = {
  id: 'clo079ls3000108jsbdbsc8pv',
  role: Role.ADMIN,
};

const traineeUser = {
  id: 'cls1rqioq000008jlf156ate0',
  role: Role.TRAINEE,
};

beforeEach(async () => {
  await clearDatabase();
  await prisma.user.createMany({
    data: [adminUser, traineeUser],
  });
});

jest.mock('../../../lib/auth', () => ({
  getServerAuthSession: jest.fn(),
}));

const newCourse = {
  name: 'Python',
  description: 'Python fundamentals',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  maxStudents: 20,
  tags: [],
};

const newCourseWithScript = {
  name: 'Python',
  description: 'Python fundamentals<script>alert("yeet")</script>',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  maxStudents: 20,
  tags: [],
};

const newCourseWithTags = {
  name: 'Testing with Jest',
  description: 'Third tag does not exist and relation should not be formed',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  maxStudents: 50,
  tags: ['Unit Testing', 'Jest', 'I do not exist'],
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
  tags: [],
};

const startDateInThePastCourse = {
  name: 'Failure',
  description: 'Start date in 1900s fails the test',
  startDate: '1900-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  maxStudents: 20,
  tags: [],
};

const lastEnrollDateAfterEndCourse = {
  name: 'Git Fundamentals',
  description:
    'This course introduces you to the basics of version control with Git.',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  lastEnrollDate: '2100-09-29T00:00:00Z',
  maxStudents: 8,
  tags: [],
};

const lastCancelDateAfterEndCourse = {
  name: 'Git Fundamentals',
  description:
    'This course introduces you to the basics of version control with Git.',
  startDate: '2100-09-27T00:00:00Z',
  endDate: '2100-09-28T00:00:00Z',
  lastEnrollDate: '2100-09-26T00:00:00Z',
  lastCancelDate: '2100-09-29T00:00:00Z',
  maxStudents: 8,
  tags: [],
};

const getTableLength = async () => {
  const allCourses = await prisma.course.findMany();
  return allCourses.length;
};

const getFirstCourse = async () => {
  return await prisma.course.findFirst();
};

const mockPostRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'POST',
    json: () => body,
  }).req;
};

const mockUpdateRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'PUT',
    json: () => body,
  }).req;
};

const mockDeleteRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'DELETE',
    json: () => body,
  }).req;
};

describe('Course API tests', () => {
  describe('GET', () => {
    (getServerAuthSession as jest.Mock).mockImplementation(async () =>
      Promise.resolve({
        user: adminUser,
      })
    );

    it('returns an empty list from the database at the beginning of the tests', async () => {
      const response = await GET();
      const data = await response.json();
      expect(data.data.length).toBe(0);
      expect(response.status).toBe(200);
    });
  });

  describe('POST', () => {
    (getServerAuthSession as jest.Mock).mockImplementation(async () =>
      Promise.resolve({
        user: adminUser,
      })
    );

    it('adds new course in to the database', async () => {
      const req = mockPostRequest(newCourse);
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Course successfully created!');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(201);
      const tblLength = await getTableLength();
      expect(tblLength).toBe(1);
    });

    it('adds new course only with existing tags to the db', async () => {
      await prisma.tag.createMany({
        data: [{ name: 'Unit Testing' }, { name: 'Jest' }],
      });
      const req = mockPostRequest(newCourseWithTags);
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toBe('Course successfully created!');

      const courseInDb = await prisma.course.findFirst({
        include: { tags: true },
      });

      expect(courseInDb).not.toBeNull();
      expect(courseInDb).toBeDefined();

      if (courseInDb) {
        courseInDb.tags.map((tag) => {
          expect(['Unit Testing', 'Jest']).toContain(tag.name);
        });
      }
    });

    it('fails with incorrect inputs', async () => {
      const req = mockPostRequest(studentsAsStringCourse);
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toContain('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(422);
    });

    it('fails if end date is prior to start date', async () => {
      const req = mockPostRequest(startAfterEndCourse);
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toContain('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      const tblLength = await getTableLength();
      expect(tblLength).toBe(0);
      expect(response.status).toBe(422);
    });

    it('fails if start date is in the past', async () => {
      const req = mockPostRequest(startDateInThePastCourse);
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toContain('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      const tblLength = await getTableLength();
      expect(tblLength).toBe(0);
      expect(response.status).toBe(422);
    });

    it('fails if last enroll date is after the end of the course', async () => {
      const req = mockPostRequest(lastEnrollDateAfterEndCourse);
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toContain('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      const tblLength = await getTableLength();
      expect(tblLength).toBe(0);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });

    it('fails if last cancel date is after the end of the course', async () => {
      const req = mockPostRequest(lastCancelDateAfterEndCourse);
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toContain('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      const tblLength = await getTableLength();
      expect(tblLength).toBe(0);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });

    it('sanitizes description on post', async () => {
      const req = mockPostRequest(newCourseWithScript);
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Course successfully created!');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(201);

      const addedCourse = await getFirstCourse();
      expect(addedCourse?.description).toBe('Python fundamentals');
    });
  });

  describe('PUT', () => {
    (getServerAuthSession as jest.Mock).mockImplementation(async () =>
      Promise.resolve({
        user: adminUser,
      })
    );

    const courseDataWithDate = {
      id: 'cloh5jr6h000008l40614d1vr',
      name: 'Spaghetti coding 101',
      description: 'Security by obscurity',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      lastEnrollDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      lastCancelDate: new Date(Date.now() + 1000 * 60 * 60 * 12),
      maxStudents: 200,
      createdById: adminUser.id,
      tags: [],
    };

    const courseData = {
      ...courseDataWithDate,
      startDate: courseDataWithDate.startDate.toString(),
      endDate: courseDataWithDate.endDate.toString(),
      lastEnrollDate: courseDataWithDate.lastEnrollDate.toString(),
      lastCancelDate: courseDataWithDate.lastCancelDate.toString(),
    };

    it('Should return 404 when course does not exist in the db', async () => {
      const req = mockUpdateRequest(courseData);

      const response = await PUT(req);
      const data = await response.json();
      expect(data.message).toContain('Course by given id was not found');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(404);
    });

    it('Updates course details accordingly', async () => {
      await prisma.tag.createMany({
        data: [{ name: 'Unit Testing' }, { name: 'Jest' }],
      });

      await prisma.course.create({
        data: {
          ...courseDataWithDate,
          tags: {
            connect: [],
          },
        },
      });

      const courseInDb = await prisma.course.findFirst({
        include: { tags: true },
      });

      const updatedCourse = {
        ...courseData,
        maxStudents: 30,
        startDate: courseData.startDate,
        endDate: courseData.endDate,
        tags: ['Unit Testing', 'Jest'],
        id: courseInDb?.id || null,
      };

      const req = mockUpdateRequest(updatedCourse);
      const response = await PUT(req);
      const data = await response.json();
      expect(data.message).toBe('Course successfully updated!');
      expect(data.messageType).toBe(MessageType.SUCCESS);

      const updatedCourseInDb = await prisma.course.findFirst({
        include: { tags: true },
      });
      if (!updatedCourseInDb) throw Error;

      expect(updatedCourseInDb.maxStudents).toBe(30);
      updatedCourseInDb.tags.map((e) => {
        expect(['Unit Testing', 'Jest']).toContain(e.name);
      });
    });

    it('Fails if last enroll date is updated to be after course has ended', async () => {
      await prisma.course.create({
        data: {
          ...courseDataWithDate,
          tags: {
            connect: [],
          },
        },
      });

      const courseInDb = await prisma.course.findFirst();
      const enrollAfterEndDate = new Date(
        new Date(courseData.endDate).getTime() + 60 * 60 * 1000
      ).toString();
      const updatedCourse = {
        ...courseData,
        lastEnrollDate: enrollAfterEndDate,
        id: courseInDb?.id || null,
      };

      const req = mockUpdateRequest(updatedCourse);
      const response = await PUT(req);
      const data = await response.json();
      expect(data.message).toBe('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });

    it('Fails if last cancel date is updated to be after course has ended', async () => {
      await prisma.course.create({
        data: {
          ...courseDataWithDate,
          tags: {
            connect: [],
          },
        },
      });

      const courseInDb = await prisma.course.findFirst();
      const cancelAfterEndDate = new Date(
        new Date(courseData.endDate).getTime() + 60 * 60 * 1000
      ).toString();
      const updatedCourse = {
        ...courseData,
        lastCancelDate: cancelAfterEndDate,
        id: courseInDb?.id || null,
      };

      const req = mockUpdateRequest(updatedCourse);
      const response = await PUT(req);
      const data = await response.json();
      expect(data.message).toBe('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });

  describe('DELETE', () => {
    const courseDataWithDate = {
      id: 'cloh5jr6h000008l40614d1vr',
      name: 'Spaghetti coding 101',
      description: 'Security by obscurity',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      lastEnrollDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      lastCancelDate: new Date(Date.now() + 1000 * 60 * 60 * 12),
      maxStudents: 200,
      createdById: adminUser.id,
      tags: [],
    };

    it('Succeeds when deleting own course', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      await prisma.course.create({
        data: {
          ...courseDataWithDate,
          tags: {
            connect: [],
          },
        },
      });

      const courseInDb = await prisma.course.findFirst();
      const req = mockDeleteRequest({ courseId: courseInDb?.id });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toBe('Course successfully deleted!');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.OK);
    });

    it("Fails when trying to delete another user's course", async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: traineeUser,
        })
      );

      await prisma.course.create({
        data: {
          ...courseDataWithDate,
          tags: {
            connect: [],
          },
        },
      });

      const courseInDb = await prisma.course.findFirst();
      const req = mockDeleteRequest({ courseId: courseInDb?.id });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toContain('Forbidden');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.FORBIDDEN);
    });

    it('Fails when trying to delete nonexistent course', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const req = mockDeleteRequest({ courseId: 'clryw94tr000008l5aol5bakq' });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toContain('Course by given id was not found');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(404);
    });
  });
});
