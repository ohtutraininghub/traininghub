import { handleCommonErrors } from '@/lib/response/errorUtil';
import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { createChannelForCourse, addUsersToChannel } from '@/lib/slack';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/response/responseUtil';
import { translator } from '@/lib/i18n';
import { StatusCodeType } from '@/lib/response/responseUtil';
import { hasCourseEditRights, isTrainerOrAdmin } from '@/lib/auth-utils';
import { courseIdSchema } from '@/lib/zod/courses';
import {
  getStudentEmailsByCourseId,
  getTrainerEmailByCreatedById,
} from '@/lib/prisma/users';

export async function POST(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();
    const body = courseIdSchema.parse(await request.json());
    const course = await prisma.course.findFirst({
      where: { id: body.courseId },
    });

    if (!isTrainerOrAdmin(user) || !hasCourseEditRights(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }
    if (!course) {
      return errorResponse({
        message: t('Common.courseNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }
    if (course.slackChannelId) {
      return errorResponse({
        message: t('Slack.channelAlreadyExists'),
        statusCode: StatusCodeType.BAD_REQUEST,
      });
    }

    const response = await createChannelForCourse(course);
    if (!response.ok) {
      return errorResponse({
        message: `${t('Slack.channelCreationFailed')}: ${response.error}`,
        statusCode: StatusCodeType.BAD_REQUEST,
      });
    }

    await prisma.course.update({
      where: { id: body.courseId },
      data: {
        slackChannelId: response.channel.id,
      },
    });

    const trainer = await getTrainerEmailByCreatedById(course.createdById);
    const students = await getStudentEmailsByCourseId(course.id);
    const studentEmails = students.map((student) => student.email);
    if (trainer) {
      studentEmails.push(trainer);
    }
    const res = await addUsersToChannel(response.channel.id, studentEmails);
    if (!res.ok) {
      return errorResponse({
        message: `Failed to add students to channel: ${res.error}`,
        statusCode: StatusCodeType.BAD_REQUEST,
      });
    }
    return successResponse({
      message: t('Slack.channelCreationSuccess'),
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}
