import { prisma } from '.';
import { Course, Prisma as prismaClient } from '@prisma/client';

export type CourseWithTags = prismaClient.CourseGetPayload<{
  include: {
    tags: true;
  };
}>;

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

export const getCourseById = async (courseId: Course['id']) => {
  return await prisma.course.findFirst({
    include: {
      tags: true,
    },
    where: { id: courseId },
  });
};

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
    where: { endDate: { gte: new Date() } },
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
