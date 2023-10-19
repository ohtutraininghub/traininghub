import { NextRequest } from 'next/server';
import { courseSignupSchema } from '@/lib/zod/courses';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';
import {
  StatusCodeType,
  successResponse,
  errorResponse,
} from '@/lib/response/responseUtil';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { insertCourseToCalendar } from '@/lib/google/calendar';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    const userId = session.user.id;
    const data = await request.json();
    const courseId = courseSignupSchema.parse(data);

    const course = await prisma.course.findFirst({
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
      where: { id: courseId },
    });

    if (!course) {
      return errorResponse({
        message: 'Could not find course with given identifier!',
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    if (course._count.students >= course.maxStudents) {
      return errorResponse({
        message: 'Course is already full!',
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }

    const userCourseIds = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        courses: {
          select: {
            id: true,
          },
        },
      },
    });

    if (userCourseIds?.courses.find((course) => course.id === courseId)) {
      return errorResponse({
        message: 'You have already enrolled!',
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        students: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await insertCourseToCalendar(userId, course);

    return successResponse({
      message: 'Enrolled succesfully!',
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}
