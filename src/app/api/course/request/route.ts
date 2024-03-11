import { NextRequest } from 'next/server';
import { courseRequestSchema } from '@/lib/zod/courses';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from '@/lib/auth';
import {
  StatusCodeType,
  MessageType,
  errorResponse,
  successResponse,
  messageResponse,
} from '@/lib/response/responseUtil';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { translator } from '@/lib/i18n';

export async function POST(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const session = await getServerAuthSession();
    const userId = session.user.id;
    const data = await request.json();
    const { courseId } = courseRequestSchema.parse(data);

    const course = await prisma.course.findFirst({
      where: { id: courseId },
    });

    if (!course) {
      return errorResponse({
        message: t('Common.courseNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }
    const userRequestIds = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        requestedCourses: {
          select: {
            id: true,
          },
        },
      },
    });

    if (
      userRequestIds?.requestedCourses.find((course) => course.id === courseId)
    ) {
      return errorResponse({
        message: t('Requests.youHaveAlreadyRequested'),
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        requesters: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return messageResponse({
      message: t('Requests.requestSuccessfull'),
      messageType: MessageType.SUCCESS,
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}
export async function PUT(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const session = await getServerAuthSession();
    const userId = session.user.id;
    const data = await request.json();
    const { courseId } = courseRequestSchema.parse(data);

    const course = await prisma.course.findFirst({
      where: { id: courseId },
      include: {
        requesters: {
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

    if (!course.requesters.find((requester) => requester.id === userId)) {
      return errorResponse({
        message: t('Common.notRequestedError'),
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }

    await prisma.course.update({
      where: { id: courseId },
      data: {
        requesters: {
          disconnect: [{ id: userId }],
        },
      },
    });

    return successResponse({
      message: t('Requests.requestRemoved'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}
