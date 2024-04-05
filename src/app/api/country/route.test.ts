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

const existingCountry = { name: 'Argentina', countryCode: 'ARG' };
const newCountry = { name: 'Brazil', countryCode: 'BR' };
const duplicateTitle = { name: 'Argentina', countryCode: 'ARG' };

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
  await prisma.country.create({
    data: existingCountry,
  });
});

describe('Tag API tests', () => {
  describe('POST', () => {
    (getServerAuthSession as jest.Mock).mockImplementation(async () =>
      Promise.resolve({
        user: adminUser,
      })
    );

    it('adds a new country to the database', async () => {
      const request = mockPostRequest(newCountry);
      const response = await POST(request);
      const data = await (response as Response).json();

      expect(data.message).toBe(`The country tag was succesfully created!`);
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect((response as Response).status).toBe(StatusCodeType.CREATED);
    });
    it('fails if identical country already exists in database', async () => {
      const request = mockPostRequest(existingCountry);
      const response = await POST(request);
      const data = await (response as Response).json();

      expect(data.message).toBe(
        `Failed to create country tag. A duplicate tag already exists.`
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect((response as Response).status).toBe(
        StatusCodeType.UNPROCESSABLE_CONTENT
      );
    });
  });

  describe('DELETE', () => {
    it('succesfully deletes an existing country if user is an admin', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const exists = await prisma.country.findFirst({
        where: {
          name: existingCountry.name,
        },
      });
      const req = mockDeleteRequest({ id: exists?.id });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toBe(`The country tag was succesfully deleted`);
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.OK);
    });
    it('deleting an existing country fails if user is a trainee', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: traineeUser,
        })
      );

      const exists = await prisma.country.findFirst({
        where: {
          name: existingCountry.name,
        },
      });

      const request = mockDeleteRequest({ id: exists?.id });
      const response = await DELETE(request);
      const data = await response.json();

      expect(data.message).toBe(`Forbidden`);
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.FORBIDDEN);
    });
    it('attempting to delete a country using a non-valid id fails with an error message', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const request = mockDeleteRequest({ id: 'foobar' });
      const response = await DELETE(request);
      const data = await response.json();

      expect(data.message).toBe(`Unprocessable content`);
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });
});
