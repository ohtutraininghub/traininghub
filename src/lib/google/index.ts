import { Course } from '@prisma/client';
import { calendar as googlecalendar } from '@googleapis/calendar';
import { UserRefreshClient } from 'google-auth-library';
import { getRefreshToken } from '@/lib/prisma/account';
import {
  createGoogleCalendarEntry,
  deleteGoogleCalendarEntry,
  findGoogleCalendarEntry,
  getUsersWithGoogleCalendar,
} from '@/lib/prisma/calendar';
import { logHandledException } from '@/lib/sentry';
import { isProduction } from '../env-utils';

export const insertCourseToCalendar = async (
  userId: string,
  course: Course
) => {
  if (!isProduction()) {
    // Don't try to insert google calendar entries
    // in test or dev environment
    console.info('=====');
    console.info('Google calendar is disabled in development environment!');
    console.info('=====');
    return;
  }

  const googleEntry = await findGoogleCalendarEntry(userId, course.id);
  if (googleEntry?.googleEventId) {
    // User doing sketchy stuff,
    // simply skip since the entry is already there
    return;
  }

  const refreshTokenAuth = await getRefreshTokenAuth(userId);
  const calendar = googlecalendar({ version: 'v3', auth: refreshTokenAuth });

  return await calendar.events
    .insert({
      calendarId: 'primary',
      ...courseRequestBody(course),
    })
    .then(async (res) => {
      const eventId = res?.data?.id;
      if (!eventId) {
        throw Error('Google response did not contain event ID!');
      }

      await createGoogleCalendarEntry(userId, course.id, eventId);
    })
    .catch(async (error) => await handleGoogleError(error));
};

export const deleteCourseFromCalendar = async (
  userId: string,
  course: Course
) => {
  const googleEntry = await findGoogleCalendarEntry(userId, course.id);
  if (!googleEntry?.googleEventId) {
    // Not google calendar entry or no permissions to calendar
    return;
  }

  const refreshTokenAuth = await getRefreshTokenAuth(userId);
  const calendar = googlecalendar({ version: 'v3', auth: refreshTokenAuth });

  calendar.events
    .delete({ calendarId: 'primary', eventId: googleEntry.googleEventId })
    .then(async () => {
      await deleteGoogleCalendarEntry(
        userId,
        course.id,
        googleEntry.googleEventId
      );
    })
    .catch(
      async (error) =>
        await handleGoogleError(
          error,
          userId,
          course.id,
          googleEntry.googleEventId
        )
    );
};

export const updateCourseToCalendars = async (course: Course) => {
  const googleCalendarsInCourse = await getUsersWithGoogleCalendar(course);
  googleCalendarsInCourse.forEach(async (user) => {
    const eventId = user.googleEventId;
    if (!eventId) {
      // Not google calendar entry or no permissions to calendar
      return;
    }

    const refreshTokenAuth = await getRefreshTokenAuth(user.userId);
    const calendar = googlecalendar({ version: 'v3', auth: refreshTokenAuth });

    calendar.events
      .update({
        calendarId: 'primary',
        eventId: eventId,
        ...courseRequestBody(course),
      })
      .catch(
        async (error) =>
          await handleGoogleError(error, user.userId, course.id, eventId)
      );
  });
};

const getRefreshTokenAuth = async (userId: string) => {
  const refreshToken = await getRefreshToken(userId, 'google');
  if (!refreshToken?.refresh_token) {
    throw Error(`Could not find user refresh token ${userId}`);
  }

  return getRefreshClient(refreshToken.refresh_token);
};

const getRefreshClient = (refreshToken: string) => {
  return new UserRefreshClient(
    process.env.GOOGLE_CLIENT_ID ?? '',
    process.env.GOOGLE_CLIENT_SECRET ?? '',
    refreshToken
  );
};

const courseRequestBody = (course: Course) => {
  return {
    requestBody: {
      colorId: '5', // yellow
      summary: course.name,
      description: course.description,
      start: {
        dateTime: course.startDate.toISOString(),
      },
      end: {
        dateTime: course.endDate.toISOString(),
      },
    },
  };
};

const handleGoogleError = async (
  error: any,
  userId?: string,
  courseId?: string,
  eventId?: string
) => {
  if (error.message === 'Insufficient Permission') {
    // User hasn't granted permissions to access calendar
    if (userId && courseId && eventId) {
      // Remove it from database also if its there
      await deleteGoogleCalendarEntry(userId, courseId, eventId);
    }
    return;
  }

  if (error.message === 'Resource has been deleted') {
    // User has manually deleted event from calendar
    if (userId && courseId && eventId) {
      // Remove it from database also if its there
      await deleteGoogleCalendarEntry(userId, courseId, eventId);
    }
    return;
  }

  // Silently log all google related errors to Sentry
  // If there is error which is not needed in Sentry
  // -> Make a handle for it above
  // For example if the permissions have been revoked,
  // we don't want the error in Sentry
  logHandledException(error);
};
