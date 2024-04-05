import { PUT } from './route';
import { clearDatabase, prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';
import { getServerAuthSession } from '@/lib/auth';
import { MessageType, StatusCodeType } from '@/lib/response/responseUtil';

const country = {
  id: '1cltzvuygh00086nvlqegqdt02',
  name: 'United States',
  countryCode: 'US',
};

const title = {
  id: '1cltzvuygh00086nvlqegqdt01',
  name: 'Employee',
};

const user = {
  id: 'clsiortzr000008k10sundybm',
  name: 'John Doe',
  email: 'john.doe@example.com',
  emailVerified: null,
  image: 'https://example.com/johndoe.jpg',
  role: 'ADMIN',
  countryId: null,
  titleId: null,
  profileCompleted: false,
};

const mockPutRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'PUT',
    json: () => body,
  }).req;
};

jest.mock('../../../lib/auth', () => ({
  getServerAuthSession: jest.fn(),
}));

beforeEach(async () => {
  await clearDatabase();
  await prisma.country.create({
    data: country,
  });
  await prisma.title.create({
    data: title,
  });
  await prisma.user.create({
    data: {
      ...user,
      role: 'TRAINEE',
    },
  });
});

describe('Profile Completion API tests', () => {
  describe('PUT', () => {
    (getServerAuthSession as jest.Mock).mockImplementation(async () =>
      Promise.resolve({
        user: user,
      })
    );
    it('should update user profile', async () => {
      const request = mockPutRequest({
        country: country.id,
        title: title.id,
      });
      const response = await PUT(request);
      const data = await response.json();

      expect(data.message).toBe(`User info successfully updated!`);
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.OK);
    });
    it('should return error if country does not exist', async () => {
      const request = mockPutRequest({
        country: '',
        title: title.id,
      });
      const response = await PUT(request);
      const data = await response.json();

      expect(data.message).toBe(`Country or title not found!`);
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.BAD_REQUEST);
    });
    it('should return error if title does not exist', async () => {
      const request = mockPutRequest({
        country: country.id,
        title: '',
      });
      const response = await PUT(request);
      const data = await response.json();

      expect(data.message).toBe(`Country or title not found!`);
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.BAD_REQUEST);
    });
    it('should return error if both country and title do not exist', async () => {
      const request = mockPutRequest({
        country: '',
        title: '',
      });
      const response = await PUT(request);
      const data = await response.json();

      expect(data.message).toBe(`Country or title not found!`);
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.BAD_REQUEST);
    });
  });
});
