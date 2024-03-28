import { prisma } from '@/lib/prisma';
import {
  StatusCodeType,
  successResponse,
  errorResponse,
} from '@/lib/response/responseUtil';
import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { translator } from '@/lib/i18n';

export async function PUT(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const session = await getServerAuthSession();
    const userId = session.user.id;
    const data = await request.json();

    if (!data.country || !data.title) {
      return errorResponse({
        message: t('Users.countryOrTitleNotFound'),
        statusCode: StatusCodeType.BAD_REQUEST,
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        country: { connect: { id: data.country } },
        title: { connect: { id: data.title } },
        profileCompleted: true,
      },
    });

    return successResponse({
      message: t('Users.userUpdated'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error: unknown) {
    return await handleCommonErrors(error);
  }
}
