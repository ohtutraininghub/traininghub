import { $Enums, Prisma } from '@prisma/client';
import { prisma } from '.';

export async function getAllUsers() {
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
  return users;
}

export async function getUserData(userId: string) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      courses: {
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
          tags: true,
          _count: {
            select: {
              students: true,
              requests: true,
            },
          },
        },
        orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
      },
      createdCourses: {
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
          tags: true,
          _count: {
            select: {
              students: true,
              requests: true,
            },
          },
        },
        orderBy: [{ startDate: 'asc' }, { name: 'asc' }],
      },
      createdTemplates: {
        orderBy: [{ name: 'asc' }],
      },
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
  });
  return userData;
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

  const studentsWithParticipation = await Promise.all(
    students.map(async (student) => {
      const isParticipating = await prisma.participation.findFirst({
        where: {
          userId: student.id,
          courseId: courseId,
        },
      });

      return {
        name: student.name,
        userId: student.id,
        isParticipating: !!isParticipating,
      };
    })
  );

  return studentsWithParticipation;
}

export async function getStudentEmailsByCourseId(courseId: string) {
  const students = await prisma.user.findMany({
    where: {
      courses: {
        some: {
          id: courseId,
        },
      },
    },
    orderBy: {
      email: 'asc',
    },
  });
  return students.flatMap((student) =>
    student.email ? { email: student.email, userId: student.id } : []
  );
}

export async function getTrainerEmailByCreatedById(createdById: string) {
  const trainer = await prisma.user.findUnique({
    where: {
      id: createdById,
    },
  });
  return trainer?.email;
}

export async function changeUserRole(userId: string, newRole: $Enums.Role) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
  return updatedUser;
}

export async function getUsersEnrolls(userId: string) {
  const courses = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      courses: {
        select: {
          id: true,
        },
      },
    },
  });
  return courses;
}

export async function getUsersRequests(userId: string) {
  const requests = await prisma.request.findMany({
    where: {
      userId: userId,
    },
  });
  return requests;
}

export type Users = Prisma.PromiseReturnType<typeof getAllUsers>;
export type UserNamesAndIds = Prisma.PromiseReturnType<
  typeof getStudentNamesByCourseId
>;
