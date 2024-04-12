import { NextRequest } from 'next/server';
import {
  StatusCodeType,
  successResponse,
  errorResponse,
} from '@/lib/response/responseUtil';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { translator } from '@/lib/i18n';
import sendNotificationsBeforeCourseStart from '@/lib/cron/cron-utils';

export async function handleSendNotifications(request: NextRequest) {
  const { t } = await translator('api');

  const authToken = request.headers.get('authorization')?.split(' ')[1];
  try {
    if (authToken && authToken === process.env.AUTH_TOKEN) {
      sendNotificationsBeforeCourseStart();
      return successResponse({
        message: t('Reminders.remindersSent'), // change the messages
        statusCode: StatusCodeType.OK,
      });
    }
    return errorResponse({
      message: t('Common.forbidden'),
      statusCode: StatusCodeType.UNAUTHORIZED,
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}
