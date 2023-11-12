import { prisma } from '@/lib/prisma';
import { StatusCodeType, successResponse } from '@/lib/response/responseUtil';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const { userId, newRole } = data;

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  return successResponse({
    message: 'User access role succesfully changed!',
    statusCode: StatusCodeType.OK,
  });
}
