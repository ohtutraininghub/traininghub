import { prisma } from '@/lib/prisma';
import {
  StatusCodeType,
  errorResponse,
  successResponse,
} from '@/lib/response/responseUtil';
import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { translator } from '@/lib/i18n';

export async function PUT(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const data = await request.json();
    const { userId, newRole } = data;

    const { user } = await getServerAuthSession();
    if (!isAdmin(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return successResponse({
      message: t('Users.roleChanged'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error: unknown) {
    return handleCommonErrors(error);
  }
}
