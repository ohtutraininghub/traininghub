import { NextRequest } from 'next/server';
import { courseEnrollSchema } from '@/lib/zod/courses';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';
import {
  StatusCodeType,
  successResponse,
  errorResponse,
} from '@/lib/response/responseUtil';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { msUntilStart } from '@/lib/timedateutils';
import { minCancelTimeMs } from '@/lib/zod/courses';
import { insertCourseToCalendar } from '@/lib/google';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    const userId = session.user.id;
    const data = await request.json();
    const courseId = courseEnrollSchema.parse(data);

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

    // Insert course to Google calendar
    await insertCourseToCalendar(userId, course);

    return successResponse({
      message: 'Enrolled succesfully!',
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    const data = await request.json();
    const courseId = courseEnrollSchema.parse(data);

    const course = await prisma.course.findFirst({
      where: { id: courseId },
      include: {
        students: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!course) {
      return errorResponse({
        message: 'Could not find course with given identifier!',
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    if (!course.students.find((student) => student.id === session.user.id)) {
      return errorResponse({
        message: 'You are not enrolled to this course',
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }

    if (msUntilStart(course.startDate) < minCancelTimeMs) {
      return errorResponse({
        message: 'No cancelling allowed after cancellation deadline',
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }

    await prisma.course.update({
      where: { id: courseId },
      data: {
        students: {
          disconnect: [{ id: session.user.id }],
        },
      },
    });

    return successResponse({
      message: 'Your enrollment was canceled',
      statusCode: StatusCodeType.OK,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}
