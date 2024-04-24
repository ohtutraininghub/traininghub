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

export const getCoursesForCsv = async (fromDate: Date, toDate: Date) => {
  const courses = await prisma.course.findMany({
    include: {
      createdBy: {
        select: {
          name: true,
        },
      },
      participations: {
        select: {
          user: {
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
          },
        },
        orderBy: {
          user: {
            name: 'asc',
          },
        },
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

  const formattedCourses = courses.map((course) => ({
    name: course.name,
    createdBy: { name: course.createdBy ? course.createdBy.name : null },
    students: course.participations.map((participation) => ({
      name: participation.user.name,
      country: {
        name: participation.user.country
          ? participation.user.country.name
          : null,
      },
      title: {
        name: participation.user.title ? participation.user.title.name : null,
      },
    })),
    startDate: course.startDate,
    endDate: course.endDate,
  }));

  return formattedCourses;
};
