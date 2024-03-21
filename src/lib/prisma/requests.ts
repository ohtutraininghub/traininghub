import { Prisma } from '@prisma/client';
import { prisma } from '.';

export async function getRequestsByCourseId(courseId: string) {
  const requests = await prisma.request.findMany({
    where: {
      courseId: courseId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  return requests.map((request) => ({
    ...request,
    name: request.user.name,
  }));
}

export type RequestsAndUserNames = Prisma.PromiseReturnType<
  typeof getRequestsByCourseId
>;
