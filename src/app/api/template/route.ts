import { NextRequest } from 'next/server';
import {
  StatusCodeType,
  errorResponse,
  successResponse,
} from '@/lib/response/responseUtil';
import { prisma } from '@/lib/prisma';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { getServerAuthSession } from '@/lib/auth';
import { isTrainerOrAdmin } from '@/lib/auth-utils';
import { translator } from '@/lib/i18n';
import { templateSchemaWithId } from '@/lib/validation/schemas';

export async function DELETE(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();
    const body = templateSchemaWithId.parse(await request.json());
    const template = await prisma.template.findFirst({
      where: { id: body.id },
    });

    if (!template) {
      return errorResponse({
        message: t('Common.templateNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    if (!isTrainerOrAdmin(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    await prisma.template.delete({
      where: { id: body.id },
    });

    return successResponse({
      message: t('Templates.templateDeleted'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}
