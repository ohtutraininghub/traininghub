import { prisma } from './prisma';
import { Prisma as prismaClient } from '@prisma/client';

const courseWithStudentCount =
  prismaClient.validator<prismaClient.CourseDefaultArgs>()({
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
  });

export type CourseWithStudentCount = prismaClient.CourseGetPayload<
  typeof courseWithStudentCount
>;

export const getCourses = async () => {
  return await prisma.course.findMany({
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
    orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
  });
};

export type GetCoursesType = prismaClient.PromiseReturnType<typeof getCourses>;
