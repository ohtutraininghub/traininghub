import { NextRequest } from 'next/server';
import {
  titleDeleteSchema,
  titleSchema,
  TitleSchemaType,
} from '@/lib/zod/titles';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  StatusCodeType,
  successResponse,
  errorResponse,
} from '@/lib/response/responseUtil';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { getServerAuthSession } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { translator } from '@/lib/i18n';

export async function POST(request: NextRequest) {
  let newTitle: TitleSchemaType | undefined;
  const { t } = await translator('api');
  try {
    const { user } = await getServerAuthSession();
    if (!isAdmin(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }
    const reqData = await request.json();
    newTitle = titleSchema.parse(reqData);
    await prisma.title.create({
      data: newTitle,
    });
    return successResponse({
      message: t('Titles.titleCreated'),
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return errorResponse({
        message: t('Titles.duplicateError'),
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }
    return await handleCommonErrors(error);
  }
}

export async function DELETE(request: NextRequest) {
  const { t } = await translator('api');
  try {
    const { user } = await getServerAuthSession();
    if (!isAdmin(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }
    const reqData = await request.json();
    const title = titleDeleteSchema.parse(reqData);

    await prisma.title.delete({
      where: {
        id: title.titleId,
      },
    });

    return successResponse({
      message: t('Titles.titleDeleted'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error: unknown) {
    return await handleCommonErrors(error);
  }
}
