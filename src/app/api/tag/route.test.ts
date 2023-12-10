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

const existingTag = { name: 'Git' };
const newTag = { name: 'Jenkins' };
const duplicateTag = { name: 'git' };
const tooLongTag = {
  name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};
const emptyTag = { name: '' };
const extraSpacesTag = { name: 'Robot  Framework' };

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
  await prisma.tag.create({
    data: existingTag,
  });
});

describe('Tag API tests', () => {
  describe('POST', () => {
    (getServerAuthSession as jest.Mock).mockImplementation(async () =>
      Promise.resolve({
        user: adminUser,
      })
    );

    it('adds a new tag to the database', async () => {
      const request = mockPostRequest(newTag);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe(`The tag was succesfully created!`);
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.CREATED);
    });
    it('fails if identical tag already exists in database', async () => {
      const request = mockPostRequest(existingTag);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe(
        `Failed to create tag. A duplicate tag already exists.`
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
    it('fails if same tag with different casing exists in database', async () => {
      const request = mockPostRequest(duplicateTag);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe(
        `Failed to create tag. A duplicate tag already exists.`
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
    it('fails if the tag name is empty', async () => {
      const request = mockPostRequest(emptyTag);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
    it('fails if the tag name is too long', async () => {
      const request = mockPostRequest(tooLongTag);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
    it('fails if there is consecutive spaces in the tag name', async () => {
      const request = mockPostRequest(extraSpacesTag);
      const response = await POST(request);
      const data = await response.json();

      expect(data.message).toBe('Unprocessable content');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });

  describe('DELETE', () => {
    it('succesfully deletes an existing tag if user is an admin', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const exists = await prisma.tag.findFirst({
        where: {
          name: existingTag.name,
        },
      });
      const req = mockDeleteRequest({ tagId: exists?.id });
      const response = await DELETE(req);
      const data = await response.json();

      expect(data.message).toBe(`The tag was succesfully deleted`);
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.OK);
    });
    it('deleting an existing tag fails if user is a trainee', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: traineeUser,
        })
      );

      const exists = await prisma.tag.findFirst({
        where: {
          name: existingTag.name,
        },
      });

      const request = mockDeleteRequest({ tagId: exists?.id });
      const response = await DELETE(request);
      const data = await response.json();

      expect(data.message).toBe(`Forbidden`);
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.FORBIDDEN);
    });
    it('attempting to delete a tag using a non-valid id fails with an error message', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const request = mockDeleteRequest({ tagId: 'foobar' });
      const response = await DELETE(request);
      const data = await response.json();

      expect(data.message).toBe(`Unprocessable content`);
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });
});
