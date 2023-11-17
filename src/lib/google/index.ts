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

export const insertCourseToCalendar = async (
  userId: string,
  course: Course
) => {
  //if (process.env.NODE_ENV !== 'production') {
  // Don't try to insert google calendar entries
  // in test or dev environment
  //  return;
  //}

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
          false,
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
          await handleGoogleError(error, true, user.userId, course.id, eventId)
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
  unblocking?: boolean,
  userId?: string,
  courseId?: string,
  eventId?: string
) => {
  if (error.status === 403 && error.message === 'Insufficient Permission') {
    // User hasn't granted permissions to access calendar
    // -> Ignore error
    return;
  }

  if (
    error.status === 410 &&
    error.message === 'Resource has been deleted' &&
    userId &&
    courseId &&
    eventId
  ) {
    // User has manually deleted resource. Remove it from database also
    await deleteGoogleCalendarEntry(userId, courseId, eventId);
    return;
  }

  if (unblocking) {
    logHandledException(error);
    return;
  }

  throw error;
};
