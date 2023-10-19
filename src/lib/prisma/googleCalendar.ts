import { prisma } from '@/lib/prisma';

export const createCalendarEntry = async (
  userId: string,
  courseId: string,
  eventId: string
) => {
  return await prisma.googleCalendar.create({
    data: {
      userId: userId,
      courseId: courseId,
      eventId: eventId,
    },
  });
};
