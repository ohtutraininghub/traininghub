import { NextRequest } from 'next/server';
import { courseEnrollSchema } from '@/lib/zod/courses';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';
import {
  StatusCodeType,
  MessageType,
  successResponse,
  errorResponse,
  messageWithDataResponse,
} from '@/lib/response/responseUtil';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { isPastDeadline } from '@/lib/timedateutils';
import { deleteCourseFromCalendar, insertCourseToCalendar } from '@/lib/google';
import { hasGoogleCalendarScope } from '@/lib/prisma/account';
import { translator } from '@/lib/i18n';

export async function POST(request: NextRequest) {
  try {
    const { t } = await translator('en', 'api');
    const session = await getServerAuthSession();
    const userId = session.user.id;
    const data = await request.json();
    const { courseId, insertToCalendar } = courseEnrollSchema.parse(data);

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
        message: t('Common.courseNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    if (course._count.students >= course.maxStudents) {
      return errorResponse({
        message: t('Enrolls.courseIsFull'),
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }

    if (isPastDeadline(course.lastEnrollDate)) {
      return errorResponse({
        message: t('Enrolls.noEnrollingAfterDeadline'),
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
        message: t('Enrolls.youHaveAlreadyEnrolled'),
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

    const hasCalendarPermissions = await hasGoogleCalendarScope(userId);

    if (insertToCalendar) {
      if (!hasCalendarPermissions) {
        return errorResponse({
          message: t('Calendar.noPermissionsToInsertEntry'),
          statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
        });
      }

      // Insert course to external calendar
      await insertCourseToCalendar(userId, course);
    }

    return messageWithDataResponse({
      message: t('Enrolls.enrollmentSuccessfull'),
      messageType: MessageType.SUCCESS,
      statusCode: StatusCodeType.CREATED,
      data: hasCalendarPermissions,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { t } = await translator('en', 'api');
    const session = await getServerAuthSession();
    const userId = session.user.id;
    const data = await request.json();
    const { courseId } = courseEnrollSchema.parse(data);

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
        message: t('Common.courseNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    if (!course.students.find((student) => student.id === userId)) {
      return errorResponse({
        message: t('Common.notEnrolledError'),
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }

    if (isPastDeadline(course.lastCancelDate)) {
      return errorResponse({
        message: t('Enrolls.noCancellingAfterDeadline'),
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }

    await prisma.course.update({
      where: { id: courseId },
      data: {
        students: {
          disconnect: [{ id: userId }],
        },
      },
    });

    // Delete course from external calendar
    await deleteCourseFromCalendar(userId, course);

    return successResponse({
      message: t('Enrolls.enrollmentCanceled'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}
