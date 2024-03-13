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
import { getStudentEmailsByCourseId } from '@/lib/prisma/users';

export async function POST(request: NextRequest) {
  try {
    console.log('got to post request');
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();
    console.log('starting course parse');
    const body = courseIdSchema.parse(await request.json());
    console.log('starting course search');
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
    const students = await getStudentEmailsByCourseId(course.id);
    const studentEmails = students.map((student) => student.email);
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
