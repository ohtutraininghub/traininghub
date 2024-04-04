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

beforeEach(async () => {
  await clearDatabase();
  await prisma.user.create({
    data: traineeUser,
  });
});

const mockUpdateRequest = (body: any) => {
  return createMocks<NextRequest>({
    method: 'PUT',
    json: () => body,
  }).req;
};

jest.mock('../../../lib/auth', () => ({
  getServerAuthSession: jest.fn(),
}));

describe('User API tests', () => {
  describe('PUT', () => {
    it("Updating another user's user role succeeds with admin rights", async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const traineeUserInDb = await prisma.user.findFirst({
        where: {
          role: Role.TRAINEE,
        },
      });

      const updatedUser = {
        userId: traineeUserInDb?.id,
        newRole: Role.TRAINER,
      };

      const req = mockUpdateRequest(updatedUser);
      const response = await PUT(req);
      const data = await response.json();

      expect(data.message).toBe('User access role successfully changed!');
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.OK);
    });

    it("Updating someone's user role fails with trainee rights", async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: traineeUser,
        })
      );

      const traineeUserInDb = await prisma.user.findFirst({
        where: {
          role: Role.TRAINEE,
        },
      });

      const updatedUser = {
        userId: traineeUserInDb?.id,
        newRole: Role.ADMIN,
      };

      const req = mockUpdateRequest(updatedUser);
      const response = await PUT(req);
      const data = await response.json();

      expect(data.message).toBe('Forbidden');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.FORBIDDEN);
    });

    it("Updating someone's user role fails with trainer rights", async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: trainerUser,
        })
      );

      const trainerUserInDb = await prisma.user.findFirst({
        where: {
          role: Role.TRAINER,
        },
      });

      const updatedUser = {
        userId: trainerUserInDb?.id,
        newRole: Role.ADMIN,
      };

      const req = mockUpdateRequest(updatedUser);
      const response = await PUT(req);
      const data = await response.json();

      expect(data.message).toBe('Forbidden');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.FORBIDDEN);
    });

    it('Updating the user role for a non-existing user fails and throws error', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const updatedUser = {
        userId: 'foo',
        newRole: Role.ADMIN,
      };

      const req = mockUpdateRequest(updatedUser);
      await expect(async () => {
        await PUT(req);
      }).rejects.toThrow();
    });

    it('Updating the user role to a non-existing role fails and throws error', async () => {
      (getServerAuthSession as jest.Mock).mockImplementation(async () =>
        Promise.resolve({
          user: adminUser,
        })
      );

      const traineeUserInDb = await prisma.user.findFirst({
        where: {
          role: Role.TRAINEE,
        },
      });

      const updatedUser = {
        userId: traineeUserInDb?.id,
        newRole: 'foo',
      };

      const req = mockUpdateRequest(updatedUser);

      await expect(async () => {
        await PUT(req);
      }).rejects.toThrow();
    });
  });
});
