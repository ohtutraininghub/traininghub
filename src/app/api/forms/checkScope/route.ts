import { hasGoogleFormsScope } from '@/lib/prisma/account';
import { NextApiRequest } from 'next';
import { errorResponse, successResponse } from '@/lib/response/responseUtil';
import { StatusCodeType } from '@/lib/response/responseUtil';

export async function POST(req: NextApiRequest) {
  try {
    const { userId } = req.body;
    const hasRequiredScope = await hasGoogleFormsScope(userId);
    if (!hasRequiredScope) {
      return errorResponse({
        message: 'User does not have required scope',
        statusCode: StatusCodeType.BAD_REQUEST,
      });
    }
    return successResponse({
      message: 'User has required scope',
      statusCode: StatusCodeType.OK,
    });
  } catch (error) {
    return errorResponse({
      message: 'Internal server error',
      statusCode: StatusCodeType.INTERNAL_SERVER_ERROR,
    });
  }
}
