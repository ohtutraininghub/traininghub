import { MessageType, StatusCodeType } from '@/lib/response/responseUtil';
import { POST, DELETE } from './route';
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

const trainerUser1 = {
  id: 'cls6jt0ck000k08lfdsrq9hll',
  role: Role.TRAINER,
};

const trainerUser2 = {
  id: 'cls6jtdvk000l08lf22co7i75',
  role: Role.TRAINER,
};

beforeEach(async () => {
  await clearDatabase();
  await prisma.user.createMany({
    data: [adminUser, traineeUser, trainerUser1, trainerUser2],
  });
});

jest.mock('../../../lib/auth', () => ({
  getServerAuthSession: jest.fn(),
}));

const newTemplate = {
  name: 'Python',
  description: 'Python fundamentals',
  maxStudents: 20,
  tags: [],
};

const newTemplateWithTags = {
  name: 'Testing with Jest',
  description: 'Third tag does not exist and relation should not be formed',
  maxStudents: 50,
  tags: ['Unit Testing', 'Jest', 'I do not exist'],
};

const newTemplateWithScript = {
  name: 'Python',
  description: 'Python fundamentals<script>alert("yeet")</script>',
  maxStudents: 20,
  tags: [],
};

const getTableLength = async () => {
  const allTemplates = await prisma.template.findMany();
  return allTemplates.length;
};

const getFirstTemplate = async () => {
  return await prisma.template.findFirst();
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

describe('Template API tests', () => {
  describe('POST', () => {
    it('Adds a new template to the database', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );
      const req = mockPostRequest(newTemplate);
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Template successfully created');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.CREATED);
      const tblLength = await getTableLength();
      expect(tblLength).toBe(1);
    });

    it('Adds new template only with existing tags to the db', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );
      await prisma.tag.createMany({
        data: [{ name: 'Unit Testing' }, { name: 'Jest' }],
      });
      const req = mockPostRequest(newTemplateWithTags);
      const response = await POST(req);
      const data = await response.json();
      expect(data.message).toBe('Template successfully created');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.CREATED);

      const templateInDb = await prisma.template.findFirst({
        include: { tags: true },
      });

      expect(templateInDb).not.toBeNull();
      expect(templateInDb).toBeDefined();

      if (templateInDb) {
        templateInDb.tags.map((tag) => {
          expect(['Unit Testing', 'Jest']).toContain(tag.name);
        });
      }
    });

    it('Sanitizes description on post', async () => {
      const req = mockPostRequest(newTemplateWithScript);
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Template successfully created');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.CREATED);

      const addedTemplate = await getFirstTemplate();
      expect(addedTemplate?.description).toBe('Python fundamentals');
    });

    it('Fails if user is not an admin or trainer', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: traineeUser,
        })
      );
      const req = mockPostRequest(newTemplate);
      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('Forbidden');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.FORBIDDEN);
    });
  });

  describe('DELETE', () => {
    const newTemplateByTrainer1 = {
      name: 'Kubernetes',
      description:
        'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
      createdById: trainerUser1.id,
      maxStudents: 15,
      tags: ['Kubernetes', 'Docker', 'CI/CD'],
    };

    const newTemplateByTrainer2 = {
      name: 'Python Fundamentals',
      description:
        'Take your first steps in Python. This course will introduce you to the basic concepts of Python!',
      createdById: trainerUser2.id,
      maxStudents: 15,
      tags: ['Kubernetes', 'Docker', 'CI/CD'],
    };

    it('Succeeds when deleting existing template', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: trainerUser1,
        })
      );
      await prisma.template.create({
        data: {
          ...newTemplateByTrainer1,
          tags: {
            connect: [],
          },
        },
      });

      const templateInDb = await prisma.template.findFirst({
        where: { name: newTemplateByTrainer1.name },
      });
      const req = mockDeleteRequest({ templateId: templateInDb?.id });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toBe('Template successfully deleted');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.OK);
    });

    it('Fails when deleting template created by another user', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: trainerUser1,
        })
      );
      await prisma.template.create({
        data: {
          ...newTemplateByTrainer2,
          tags: {
            connect: [],
          },
        },
      });

      const templateInDb = await prisma.template.findFirst();
      const req = mockDeleteRequest({ templateId: templateInDb?.id });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toContain('Forbidden');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(403);
    });

    it('Fails when trying to delete nonexistent template', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: trainerUser1,
        })
      );
      const req = mockDeleteRequest({
        templateId: 'clryw94tr000008l5aol5bakq',
      });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toContain('Template by given id was not found');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(404);
    });
  });
});
