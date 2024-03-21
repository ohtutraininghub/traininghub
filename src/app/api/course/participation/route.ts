import { getServerAuthSession } from '@/lib/auth';
import { isTrainerOrAdmin } from '@/lib/auth-utils';
import { translator } from '@/lib/i18n';
import { prisma } from '@/lib/prisma';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import {
  errorResponse,
  StatusCodeType,
  successResponse,
} from '@/lib/response/responseUtil';
import { courseAndUserSchema } from '@/lib/zod/courses';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const session = await getServerAuthSession();
    const data = await request.json();
    const { courseId, userId } = courseAndUserSchema.parse(data);

    if (!isTrainerOrAdmin(session.user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    prisma.participation.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });
    return successResponse({
      message: t('Participations.participationAdded'),
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const session = await getServerAuthSession();
    const data = await request.json();
    const { courseId, userId } = courseAndUserSchema.parse(data);

    if (!isTrainerOrAdmin(session.user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    await prisma.participation.deleteMany({
      where: {
        courseId: courseId,
        userId: userId,
      },
    });
    return successResponse({
      message: t('Participations.participationRemoved'),
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}
