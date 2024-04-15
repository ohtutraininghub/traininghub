import { getCoursesForCsv } from '@/lib/prisma/courses';
import { NextResponse, NextRequest } from 'next/server';
import { StatusCodeType, errorResponse } from '@/lib/response/responseUtil';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { getServerAuthSession } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { translator } from '@/lib/i18n';

export async function GET(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();
    if (!isAdmin(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }
    const fromDate = new Date(
      request.nextUrl.searchParams.get('fromDate') || ''
    );
    const toDate = new Date(request.nextUrl.searchParams.get('toDate') || '');
    if (!fromDate.valueOf() || !toDate.valueOf()) {
      return errorResponse({
        message: t('Statistics.invalidDateRange'),
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }
    const courses = await getCoursesForCsv(fromDate, toDate);
    return NextResponse.json({ data: courses }, { status: StatusCodeType.OK });
  } catch (error) {
    return handleCommonErrors(error);
  }
}
