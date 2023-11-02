import { Course } from '@prisma/client';
import { calendar as googlecalendar } from '@googleapis/calendar';
import { UserRefreshClient } from 'google-auth-library';
import { getRefreshToken } from '@/lib/prisma/account';
import { createGoogleCalendarEntry } from '@/lib/prisma/calendar';
import { getGoogleCalendarsInCourse } from '@/lib/prisma/courses';
import { logHandledException } from '@/lib/sentry';

export const insertCourseToCalendar = async (
  userId: string,
  course: Course
) => {
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
    .catch((error) => handleGoogleError(error));
};

export const updateCourseToCalendars = async (course: Course) => {
  const googleCalendarsInCourse = await getGoogleCalendarsInCourse(course.id);
  googleCalendarsInCourse?.students.forEach((student) => {
    const refreshToken = student?.accounts[0]?.refresh_token;
    const eventId = student?.calendar[0]?.googleEventId;

    if (!refreshToken || !eventId) {
      // Likely haven't granted permissions to calendar
      return;
    }

    const calendar = googlecalendar({
      version: 'v3',
      auth: getRefreshClient(refreshToken),
    });

    calendar.events
      .update({
        calendarId: 'primary',
        eventId: eventId,
        ...courseRequestBody(course),
      })
      .catch((error) => handleGoogleError(error, true));
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

const handleGoogleError = (error: any, unblocking?: boolean) => {
  if (error.status === 403 && error.message === 'Insufficient Permission') {
    // User hasn't granted permissions to access calendar
    // -> Ignore error
    return;
  }

  if (unblocking) {
    logHandledException(error);
    return;
  }

  throw error;
};
