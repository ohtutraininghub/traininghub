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

    // Uncomment and use this check if you want to prevent creating multiple forms for the same course
    // if (course.formsId) {
    //     return errorResponse({
    //         message: t('GoogleForm.FormAlreadyExists'),
    //         statusCode: StatusCodeType.BAD_REQUEST,
    //     });
    // }

    const formResponse = await createCourseFeedbackForm(course);
    if (!formResponse.ok) {
      return errorResponse({
        message: `${t('GoogleForms.formCreationFailed')}: ${
          formResponse.error
        }`,
        statusCode: StatusCodeType.BAD_REQUEST,
      });
    }

    // Assuming formResponse contains the details of the created form
    return successResponse(formResponse.data);
  } catch (error) {
    return handleCommonErrors(error);
  }
}
