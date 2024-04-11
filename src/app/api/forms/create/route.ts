import { createCourseFeedbackForm } from '@/lib/google';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/response/responseUtil';
import { translator } from '@/lib/i18n';
import { StatusCodeType } from '@/lib/response/responseUtil';
import { hasCourseEditRights, isTrainerOrAdmin } from '@/lib/auth-utils';
import { courseIdSchema } from '@/lib/zod/courses';
import { getStudentEmailsByCourseId } from '@/lib/prisma/users';
import { sendFeedbackRequestedMessage } from '@/lib/slack';

export async function POST(request: NextRequest) {
  try {
    const { t } = await translator('api');
    const { user } = await getServerAuthSession();
    const body = courseIdSchema.parse(await request.json());
    const course = await prisma.course.findFirst({
      where: { id: body.courseId },
    });

    if (!course) {
      return errorResponse({
        message: t('Common.courseNotFound'),
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }

    if (!isTrainerOrAdmin(user) || !hasCourseEditRights(user)) {
      return errorResponse({
        message: t('Common.forbidden'),
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }

    if (course.googleFormsId) {
      return errorResponse({
        message: t('GoogleForms.formAlreadyExists'),
        statusCode: StatusCodeType.BAD_REQUEST,
      });
    }

    const formResponse = await createCourseFeedbackForm(user.id, course);
    if (!formResponse.ok) {
      return errorResponse({
        message: t('GoogleForms.formCreationFailed'),
        statusCode: StatusCodeType.BAD_REQUEST,
      });
    }

    await prisma.course.update({
      where: { id: course.id },
      data: { googleFormsId: formResponse.data.formId },
    });

    const students = await getStudentEmailsByCourseId(course.id);
    const studentEmails = students.map((student) => student.email);

    for (const studentEmail of studentEmails) {
      await sendFeedbackRequestedMessage(
        studentEmail,
        course,
        formResponse.data.formUrl
      );
    }

    return successResponse({
      message: t('GoogleForms.formCreated'),
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}
