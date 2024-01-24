import { prisma } from '@/lib/prisma';
import { Course } from '@prisma/client';

export const createGoogleCalendarEntry = async (
  userId: string,
  courseId: string,
  eventId: string,
  templateId: string
) => {
  return await prisma.calendar.create({
    data: {
      userId: userId,
      courseId: courseId,
      googleEventId: eventId,
      templateId: templateId,
    },
  });
};

export const deleteGoogleCalendarEntry = async (
  userId: string,
  courseId: string,
  eventId: string
) => {
  return await prisma.calendar.deleteMany({
    where: {
      userId: userId,
      courseId: courseId,
      googleEventId: eventId,
    },
  });
};

export const findGoogleCalendarEntry = async (
  userId: string,
  courseId: string
) => {
  return await prisma.calendar.findFirst({
    where: {
      userId: userId,
      courseId: courseId,
    },
    select: {
      googleEventId: true,
    },
  });
};

export const getUsersWithGoogleCalendar = async (course: Course) => {
  return await prisma.calendar.findMany({
    where: {
      courseId: course.id,
    },
    select: {
      userId: true,
      googleEventId: true,
    },
  });
};
