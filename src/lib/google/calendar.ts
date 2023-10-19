import { Course } from '@prisma/client';
import { calendar as googlecalendar } from '@googleapis/calendar';
import { UserRefreshClient } from 'google-auth-library';
import { getRefreshToken } from '@/lib/prisma/account';
import { upsertCalendarEntry } from '@/lib/prisma/googleCalendar';

const getRefreshTokenAuth = async (userId: string) => {
  const refreshToken = await getRefreshToken(userId, 'google');
  if (!refreshToken?.refresh_token) {
    throw Error(`Could not find user refresh token ${userId}`);
  }

  return new UserRefreshClient(
    process.env.GOOGLE_CLIENT_ID ?? '',
    process.env.GOOGLE_CLIENT_SECRET ?? '',
    refreshToken.refresh_token
  );
};

export const insertCourseToCalendar = async (
  userId: string,
  course: Course
) => {
  const refreshTokenAuth = await getRefreshTokenAuth(userId);
  const calendar = googlecalendar({ version: 'v3', auth: refreshTokenAuth });

  calendar.events.insert(
    {
      calendarId: 'primary',
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
    },
    async (err, event) => {
      if (err) {
        // Let error handling handle
        throw err;
      }

      const eventId = event?.data?.id;
      if (!eventId) throw Error('Google response did not contain event ID!');

      await upsertCalendarEntry(userId, course.id, eventId);
    }
  );
};
