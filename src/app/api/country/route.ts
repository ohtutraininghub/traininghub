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
    const existingCountry = await prisma.country.findFirst({
      where: { name: reqData.name },
    });

    if (existingCountry) {
      return errorResponse({
        message: t('Countries.duplicateError'),
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }
    await prisma.country.create({
      data: reqData as CountrySchemaType,
    });
    return successResponse({
      message: t('Countries.tagCreated'),
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    )
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
      message: t('Countries.tagDeleted'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error: unknown) {
    return await handleCommonErrors(error);
  }
}
