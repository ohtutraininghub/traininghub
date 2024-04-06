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

export const coursesWithStartDateBetweenDates = async (
  startDateStart: Date,
  startDateEnd: Date
) => {
  const coursesWithStudents = await prisma.course.findMany({
    where: {
      startDate: {
        gte: startDateStart,
        lte: startDateEnd,
      },
    },
    include: {
      students: {
        select: {
          email: true,
        },
      },
    },
  });

  return coursesWithStudents;
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
