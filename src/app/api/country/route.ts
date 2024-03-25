import { NextRequest } from 'next/server';
import { countryDeleteSchema, CountrySchemaType } from '@/lib/zod/countries';
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
    console.log(
      'REQDATA------------------------------------------------------',
      reqData
    );
    await prisma.country.create({
      data: reqData as CountrySchemaType,
    });
    return successResponse({
      message: t('Tags.tagCreated'),
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return errorResponse({
        message: t('Tags.duplicateError'),
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
    const country = countryDeleteSchema.parse(reqData);

    await prisma.country.delete({
      where: {
        id: country.id,
      },
    });

    return successResponse({
      message: t('Tags.tagDeleted'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error: unknown) {
    return await handleCommonErrors(error);
  }
}
