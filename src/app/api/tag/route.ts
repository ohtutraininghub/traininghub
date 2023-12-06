import { NextRequest } from 'next/server';
import { tagDeleteSchema, tagSchema, TagSchemaType } from '@/lib/zod/tags';
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
  let newTag: TagSchemaType | undefined;
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
    newTag = tagSchema.parse(reqData);
    await prisma.tag.create({
      data: newTag,
    });
    return successResponse({
      message: t('Tags.tagCreated', { name: newTag.name }),
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return errorResponse({
        message: t('Tags.duplicateError', { name: newTag?.name ?? '' }),
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
        message: 'Forbidden',
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }
    const reqData = await request.json();
    const tag = tagDeleteSchema.parse(reqData);

    await prisma.tag.delete({
      where: {
        id: tag.tagId,
      },
    });

    return successResponse({
      message: t('Tags.tagDeleted'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error: unknown) {
    return handleCommonErrors(error);
  }
}
