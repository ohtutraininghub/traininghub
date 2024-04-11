import { NextRequest } from 'next/server';
import {
  StatusCodeType,
  errorResponse,
  successResponse,
} from '@/lib/response/responseUtil';
import { translator } from '@/lib/i18n';
import sendNotificationsBeforeCourseStart from '@/lib/cron/cron-utils';

export async function handler(request: NextRequest) {
  const { t } = await translator('api');
  const { APP_KEY } = process.env;

  // tarkista toimiiko tää authorization header näin
  const ACTION_KEY = request.headers.get('authorization')?.split(' ')[1];
  try {
    if (ACTION_KEY === APP_KEY) {
      sendNotificationsBeforeCourseStart();
      return successResponse({
        message: t('Courses.courseUpdated'), // change the messages
        statusCode: StatusCodeType.OK,
      });
    } 
      return errorResponse({
        message: t('Courses.courseUpdated'),
        statusCode: StatusCodeType.UNAUTHORIZED,
      });
    
  } catch (err) {
    return errorResponse({
      message: t('Courses.courseUpdated'),
      statusCode: StatusCodeType.INTERNAL_SERVER_ERROR,
    });
  }
}
