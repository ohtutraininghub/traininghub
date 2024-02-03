import { MessageType, StatusCodeType } from '@/lib/response/responseUtil';
import { DELETE } from './route';
import { prisma, clearDatabase } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { Role } from '@prisma/client';
import { getServerAuthSession } from '@/lib/auth';

const TrainerUser1 = {
  id: 'clo079ls3000108jsbdbsc8pv',
  role: Role.TRAINER,
};

const TrainerUser2 = {
  id: 'clo079ls4000108jsbdbsc8pv',
  role: Role.TRAINER,
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
    data: { id: TrainerUser1.id },
  });
  await prisma.user.create({
    data: { id: TrainerUser2.id },
  });
});

jest.mock('../../../lib/auth', () => ({
  getServerAuthSession: jest.fn(),
}));

describe('DELETE', () => {
  (getServerAuthSession as jest.Mock).mockImplementation(async () =>
    Promise.resolve({
      user: TrainerUser1,
    })
  );

  const newTemplateByTrainer1 = {
    name: 'Kubernetes',
    description:
      'Take your first steps in using Kubernetes for container orchestration. This course will introduce you to the basic concepts and building blocks of Kubernetes and the architecture of the system. Get ready to start you cloud native journey!',
    createdById: TrainerUser1.id,
    maxStudents: 15,
    tags: ['Kubernetes', 'Docker', 'CI/CD'],
  };

  const newTemplateByTrainer2 = {
    name: 'Python Fundamentals',
    description:
      'Take your first steps in Python. This course will introduce you to the basic concepts of Python!',
    createdById: TrainerUser2.id,
    maxStudents: 15,
    tags: ['Kubernetes', 'Docker', 'CI/CD'],
  };

  it('Succeeds when deleting existing template', async () => {
    await prisma.template.create({
      data: {
        ...newTemplateByTrainer1,
        tags: {
          connect: [],
        },
      },
    });

    const templateInDb = await prisma.template.findFirst();
    const req = mockDeleteRequest({ templateId: templateInDb?.id });
    const response = await DELETE(req);
    const data = await response.json();

    expect(data.message).toBe('Template successfully deleted');
    expect(data.messageType).toBe(MessageType.SUCCESS);
    expect(response.status).toBe(StatusCodeType.OK);
  });

  it('Fails when deleting template created by another user', async () => {
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
    const req = mockDeleteRequest({ templateId: 'clryw94tr000008l5aol5bakq' });
    const response = await DELETE(req);
    const data = await response.json();

    expect(data.message).toContain('Template by given id was not found');
    expect(data.messageType).toBe(MessageType.ERROR);
    expect(response.status).toBe(404);
  });
});
