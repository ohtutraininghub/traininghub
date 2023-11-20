import { $Enums, Prisma } from '@prisma/client';
import { prisma } from '.';

export async function getAllUsers() {
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
  return users;
}

export async function changeUserRole(userId: string, newRole: $Enums.Role) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
  return updatedUser;
}

export type Users = Prisma.PromiseReturnType<typeof getAllUsers>;
