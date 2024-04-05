import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';
import { POST, DELETE } from './route';
import { clearDatabase, prisma } from '@/lib/prisma';
import { MessageType, StatusCodeType } from '@/lib/response/responseUtil';
import { Role } from '@prisma/client';
import { getServerAuthSession } from '@/lib/auth';

const adminUser = {
  id: '987654',
  role: Role.ADMIN,
};

const traineeUser = {
  id: '123456',
  role: Role.TRAINEE,
};

const existingTitle = { name: 'Boss' };
const newTitle = { name: 'Employee' };
const duplicateTitle = { name: 'boss' };
const tooLongTitle = {
  name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};
const emptyTitle = { name: '' };
const extraSpacesTitle = { name: 'Bo  ss' };

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

jest.mock('../../../lib/auth', () => ({
  getServerAuthSession: jest.fn(),
}));

beforeEach(async () => {
  await clearDatabase();
  await prisma.title.create({
    data: existingTitle,
  });
});

describe('Tag API tests', () => {
  describe('POST', () => {
    (getServerAuthSession as jest.Mock).mockImplementation(async () =>
      Promise.resolve({
        user: adminUser,
      })
    );

    it('adds a new title to the database', async () => {
      const request = mockPostRequest(newTitle);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe(`The title was succesfully created!`);
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.CREATED);
    });
    it('fails if identical title already exists in database', async () => {
      const request = mockPostRequest(existingTitle);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe(
        `Failed to create title. A duplicate title already exists.`
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
    it('fails if same title with different casing exists in database', async () => {
      const request = mockPostRequest(duplicateTitle);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe(
        `Failed to create title. A duplicate title already exists.`
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
    it('fails if the title name is empty', async () => {
      const request = mockPostRequest(emptyTitle);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
    it('fails if the title name is too long', async () => {
      const request = mockPostRequest(tooLongTitle);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
    it('fails if there is consecutive spaces in the title name', async () => {
      const request = mockPostRequest(extraSpacesTitle);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });

  describe('DELETE', () => {
    it('succesfully deletes an existing title if user is an admin', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const exists = await prisma.title.findFirst({
        where: {
          name: existingTitle.name,
        },
      });
      const req = mockDeleteRequest({ titleId: exists?.id });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toBe(`The title was succesfully deleted`);
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.OK);
    });
    it('deleting an existing title fails if user is a trainee', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: traineeUser,
        })
      );

      const exists = await prisma.title.findFirst({
        where: {
          name: existingTitle.name,
        },
      });

      const request = mockDeleteRequest({ titleId: exists?.id });
      const response = await DELETE(request);
      const data = await response.json();

      expect(data.message).toBe(`Forbidden`);
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.FORBIDDEN);
    });
    it('attempting to delete a title using a non-valid id fails with an error message', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const request = mockDeleteRequest({ titleId: 'foobar' });
      const response = await DELETE(request);
      const data = await response.json();

      expect(data.message).toBe(`Unprocessable content`);
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });
});
