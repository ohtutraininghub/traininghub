import { prisma } from './prisma';
import { Prisma as prismaClient } from '@prisma/client';

export type CourseWithTagsAndStudentCount = prismaClient.CourseGetPayload<{
  include: {
    _count: {
      select: {
        students: true;
      };
    };
    tags: true;
  };
}>;

export const getCourses = async () => {
  return await prisma.course.findMany({
    include: {
      _count: {
        select: {
          students: true,
        },
      },
      tags: true,
    },
    orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
  });
};

export const getEnrolledCourseIdsByUserId = async (userId: string) => {
  return (
    await prisma.course.findMany({
      where: {
        students: {
          some: {
            id: {
              equals: userId,
            },
          },
        },
      },
      select: {
        id: true,
      },
    })
  ).map((data) => data.id);
};

export type GetCoursesType = prismaClient.PromiseReturnType<typeof getCourses>;
