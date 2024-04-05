import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { PUT } from './route';
import { MessageType, StatusCodeType } from '@/lib/response/responseUtil';
import { clearDatabase, prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

const adminUser = {
  id: 'cloeouh4x0000qiexq8tqzvh7',
  role: Role.ADMIN,
};

const trainerUser = {
  id: 'cloeouh4x0000qiexq8tqzvh8',
  role: Role.TRAINER,
};

const traineeUser = {
  id: 'cloeouh4x0000qiexq8tqzvh9',
  role: Role.TRAINEE,
};

const newCountry = {
  id: 'cloeouh4x0000qiexq8tqqwer',
  name: 'Country 1',
  countryCode: 'C1',
};

beforeEach(async () => {
  await clearDatabase();
  await prisma.user.create({
    data: traineeUser,
  });
  await prisma.country.create({
    data: newCountry,
  });
});

const mockUpdateRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'PUT',
    json: () => body,
  }).req;
};

jest.mock('../../../../lib/auth', () => ({
  getServerAuthSession: jest.fn(),
}));

describe('User API tests', () => {
  describe('PUT', () => {
    it("Updating another user's country succeeds with admin rights", async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const updatedUser = {
        userId: traineeUser.id,
        countryId: newCountry.id,
      };

      const req = mockUpdateRequest(updatedUser);
      const response = await PUT(req);
      const data = await response.json();

      expect(data.message).toBe('User country successfully changed!');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.OK);
    });

    it('Updating user country fails with trainer rights', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: trainerUser,
        })
      );

      const updatedUser = {
        userId: traineeUser.id,
        countryId: newCountry.id,
      };

      const req = mockUpdateRequest(updatedUser);
      const response = await PUT(req);
      const data = await response.json();

      expect(data.message).toBe('Forbidden');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.FORBIDDEN);
    });

    it('Updating the country for a non-existing user fails and throws error', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const updatedUser = {
        userId: 'foo',
        countryId: newCountry.id,
      };

      const req = mockUpdateRequest(updatedUser);

      await expect(async () => {
        await PUT(req);
      }).rejects.toThrow();
    });

    it('Updating the country for a non-existing country fails and throws error', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const updatedUser = {
        userId: traineeUser.id,
        countryId: 'foo',
      };

      const req = mockUpdateRequest(updatedUser);

      await expect(async () => {
        await PUT(req);
      }).rejects.toThrow();
    });
  });
});
