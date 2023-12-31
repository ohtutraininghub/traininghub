import { NextRequest } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { insertCourseToCalendar } from '@/lib/google';
import { prisma } from '@/lib/prisma';
import {
  StatusCodeType,
  errorResponse,
  successResponse,
} from '@/lib/response/responseUtil';
import { translator } from '@/lib/i18n';
import { permanentRedirect } from 'next/navigation';

/**
 * This route is required because after successful calendar scope grant
 * the user has to be redirected to course page and the course has to be
 * added to the calendar.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  const handleRequest = await commonBody(courseId);

  if (handleRequest) {
    // Return error response if failed
    return handleRequest;
  }

  // And redirect to course modal
  permanentRedirect(`/?courseId=${courseId}`);
}

export async function POST(request: NextRequest) {
  const { t } = await translator('api');
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  const handleRequest = await commonBody(courseId);

  if (handleRequest) {
    // Return error response if failed
    return handleRequest;
  }

  return successResponse({
    message: t('Courses.addedToCalendar'),
    statusCode: StatusCodeType.CREATED,
  });
}

const commonBody = async (courseId: string | null) => {
  const { t } = await translator('api');

  if (!courseId) {
    return errorResponse({
      message: t('Courses.idMissing'),
      statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
    });
  }

  const session = await getServerAuthSession();
  const userId = session.user.id;

  const course = await prisma.course.findFirst({
    where: { id: courseId },
    include: {
      students: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!course) {
    return errorResponse({
      message: t('Common.courseNotFound'),
      statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
    });
  }

  if (!course.students.some((student) => student.id === userId)) {
    return errorResponse({
      message: t('Common.notEnrolledError'),
      statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
    });
  }

  // Insert course to external calendar
  await insertCourseToCalendar(userId, course);
};
