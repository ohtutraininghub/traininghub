import { $Enums, Prisma } from '@prisma/client';
import { prisma } from '.';

export async function getAllUsers() {
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
  return users;
}

export async function getStudentNamesByCourseId(courseId: string) {
  const students = await prisma.user.findMany({
    where: {
      courses: {
        some: {
          id: courseId,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
  return students.flatMap((student) =>
    student.name ? { name: student.name, userId: student.id } : []
  );
}

export async function changeUserRole(userId: string, newRole: $Enums.Role) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
  return updatedUser;
}

export type Users = Prisma.PromiseReturnType<typeof getAllUsers>;
export type UserNamesAndIds = Prisma.PromiseReturnType<
  typeof getStudentNamesByCourseId
>;
