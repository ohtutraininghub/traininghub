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
import { templateDeleteSchema } from '@/lib/zod/templates';

export async function DELETE(request: NextRequest) {
  console.log('template delete');
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();
    const reqData = await request.json();
    const template = templateDeleteSchema.parse(reqData);

    const template_exists = await prisma.template.findFirst({
      where: { id: template.templateId },
    });

    if (!template_exists) {
      return errorResponse({
        message: t('Common.courseNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    if (!isTrainerOrAdmin(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    if (user.id !== template_exists.createdById) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    await prisma.template.delete({
      where: {
        id: template.templateId,
      },
    });

    return successResponse({
      message: t('Templates.templateDeleted'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}
