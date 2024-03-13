import { NextResponse, NextRequest } from 'next/server';
import {
  courseSchema,
  courseSchemaWithId,
  courseIdSchema,
} from '@/lib/zod/courses';
import {
  StatusCodeType,
  errorResponse,
  successResponse,
} from '@/lib/response/responseUtil';
import { prisma } from '@/lib/prisma';
import { Tag } from '@prisma/client';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { getServerAuthSession } from '@/lib/auth';
import {
  hasCourseEditRights,
  hasCourseDeleteRights,
  isTrainerOrAdmin,
} from '@/lib/auth-utils';
import {
  updateCourseToCalendars,
  deleteEventFromCalendarWhenCourseDeleted,
} from '@/lib/google';
import { translator } from '@/lib/i18n';
import {
  archiveChannel,
  sendCoursePoster,
  sendTrainingCancelledMessage,
} from '@/lib/slack';
import { getStudentEmailsByCourseId } from '@/lib/prisma/users';

const parseTags = async (tags: string[]): Promise<Tag[]> => {
  const allTags = await prisma.tag.findMany();
  return allTags.filter((e) => tags.includes(e.name));
};

export async function GET() {
  const courses = await prisma.course.findMany();
  return NextResponse.json({ data: courses }, { status: StatusCodeType.OK });
}

export async function POST(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();
    if (!isTrainerOrAdmin(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }
    const data = await request.json();
    const body = courseSchema.parse(data);
    const parsedTags = await parseTags(body.tags);
    const course = await prisma.course.create({
      data: {
        ...body,
        createdById: user.id,
        tags: {
          connect: parsedTags.map((tag) => ({ id: tag.id })),
        },
      },
    });
    // Send course poster to slack
    await sendCoursePoster(course);

    return successResponse({
      message: t('Courses.courseCreated'),
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();
    const body = courseSchemaWithId.parse(await request.json());
    const parsedTags = await parseTags(body.tags);
    const course = await prisma.course.findFirst({
      where: { id: body.id },
    });
    if (!course) {
      return errorResponse({
        message: t('Common.courseNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    if (!hasCourseEditRights(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: body.id },
      data: {
        ...body,
        createdById: course.createdById,
        tags: {
          set: [],
          connect: parsedTags.map((tag) => ({ id: tag.id })),
        },
      },
    });

    // Update course to Google calendars
    await updateCourseToCalendars(updatedCourse);

    return successResponse({
      message: t('Courses.courseUpdated'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();

    const reqData = await request.json();
    const courseData = courseIdSchema.parse(reqData);
    const enrolledStudents = await getStudentEmailsByCourseId(
      courseData.courseId
    );

    const course = await prisma.course.findFirst({
      where: { id: courseData.courseId },
    });

    if (!course) {
      return errorResponse({
        message: t('Common.courseNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    if (!hasCourseDeleteRights(user, course)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    await deleteEventFromCalendarWhenCourseDeleted(course);

    const deleteCalendarEvents = prisma.calendar.deleteMany({
      where: {
        courseId: courseData.courseId,
      },
    });

    const deleteCourse = prisma.course.delete({
      where: {
        id: courseData.courseId,
      },
    });

    // Send Slack message to enrolled students
    for (const student of enrolledStudents) {
      await sendTrainingCancelledMessage(student.email, course);
    }

    const test_channel_id = 'C06NDH0E3MH';
    const test_channel_name = `tmp-traininghub-robot-framework-basics-5`;

    if (`tmp-traininghub-${course.name}` === test_channel_name) {
      await archiveChannel(test_channel_id, course.name);
    }

    await prisma.$transaction([deleteCalendarEvents, deleteCourse]);

    return successResponse({
      message: t('Courses.courseDeleted'),
      statusCode: StatusCodeType.OK,
    });
  } catch (error) {
    return await handleCommonErrors(error);
  }
}
