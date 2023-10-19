import { prisma } from '@/lib/prisma';

export const upsertCalendarEntry = async (
  userId: string,
  courseId: string,
  eventId: string
) => {
  return await prisma.googleCalendar.upsert({
    where: {
      userId_courseId: { userId, courseId },
    },
    update: {
      eventId: eventId,
    },
    create: {
      userId: userId,
      courseId: courseId,
      eventId: eventId,
    },
  });
};
