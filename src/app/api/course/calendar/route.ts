import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { insertCourseToCalendar } from '@/lib/google';
import { prisma } from '@/lib/prisma';
import { StatusCodeType, errorResponse } from '@/lib/response/responseUtil';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  if (!courseId) {
    return errorResponse({
      message: 'Course id param missing!',
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
      message: 'Course by given id was not found!',
      statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
    });
  }

  if (!course.students.includes({ id: userId })) {
    return errorResponse({
      message: 'You have not enrolled for this course!',
      statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
    });
  }

  // Insert course to external calendar
  await insertCourseToCalendar(userId, course);

  // And redirect to course modal
  return NextResponse.redirect(new URL(`/?courseId=${courseId}`, request.url));
}
