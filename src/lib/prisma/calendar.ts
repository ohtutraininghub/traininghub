import { prisma } from '@/lib/prisma';

export const createGoogleCalendarEntry = async (
  userId: string,
  courseId: string,
  eventId: string
) => {
  return await prisma.calendar.create({
    data: {
      userId: userId,
      courseId: courseId,
      googleEventId: eventId,
    },
  });
};
