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

export type CourseWithInfo = prismaClient.CourseGetPayload<{
  include: {
    createdBy: {
      select: {
        name: true;
      };
    };
    tags: true;
    _count: {
      select: {
        students: true;
        requests: true;
      };
    };
  };
}>;

export type GetCoursesType = prismaClient.PromiseReturnType<typeof getCourses>;

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
      createdBy: {
        select: {
          name: true,
        },
      },
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

export const getAllCourses = async () => {
  return await prisma.course.findMany({
    include: {
      createdBy: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          students: true,
          requests: true,
        },
      },
      tags: true,
    },
    orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
  });
};

export const getCoursesForCsv = async (fromDate: Date, toDate: Date) => {
  return await prisma.course.findMany({
    include: {
      createdBy: {
        select: {
          name: true,
        },
      },
      students: {
        select: {
          name: true,
          country: {
            select: {
              name: true,
            },
          },
          title: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ name: 'asc' }],
      },
    },
    orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
    where: {
      OR: [
        { startDate: { gte: fromDate, lte: toDate } },
        { endDate: { gte: fromDate, lte: toDate } },
        {
          AND: [{ startDate: { lte: fromDate } }, { endDate: { gte: toDate } }],
        },
      ],
    },
  });
};
