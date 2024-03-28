import { prisma } from '@/lib/prisma';
import {
  StatusCodeType,
  errorResponse,
  successResponse,
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
    const country = await prisma.country.findFirst({
      where: { name: data.country },
    });
    const title = await prisma.title.findFirst({
      where: { name: data.title },
    });
    if (!country || !title) {
      return errorResponse({
        message: t('Users.countryOrTitleNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        country: { connect: { id: country?.id } },
        title: { connect: { id: title?.id } },
        profileCompleted: true,
      },
    });

    return successResponse({
      message: t('Users.userCreated'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error: unknown) {
    console.log(error);
    return await handleCommonErrors(error);
  }
}
