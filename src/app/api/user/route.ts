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

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const { userId, newRole } = data;

  try {
    const { user } = await getServerAuthSession();
    if (!isAdmin(user)) {
      return errorResponse({
        message: 'Forbidden',
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return successResponse({
      message: 'User access role succesfully changed!',
      statusCode: StatusCodeType.OK,
    });
  } catch (error: unknown) {
    return handleCommonErrors(error);
  }
}
