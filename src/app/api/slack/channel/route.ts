import { handleCommonErrors } from '@/lib/response/errorUtil';
import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { createChannelForCourse } from '@/lib/slack';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/response/responseUtil';
import { translator } from '@/lib/i18n';
import { StatusCodeType } from '@/lib/response/responseUtil';
import { isTrainerOrAdmin } from '@/lib/auth-utils';
import { courseIdSchema } from '@/lib/zod/courses';

export async function POST(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();
    const body = courseIdSchema.parse(await request.json());
    const course = await prisma.course.findFirst({
      where: { id: body.courseId },
    });

    if (!isTrainerOrAdmin(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }
    if (!course) {
      return errorResponse({
        message: t('Common.courseNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    const response = await createChannelForCourse(course);
    if (!response.ok) {
      return errorResponse({
        message: `Failed to create channel: ${response.error}`,
        statusCode: StatusCodeType.BAD_REQUEST,
      });
    }

    return successResponse({
      message: 'Channel created',
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}
