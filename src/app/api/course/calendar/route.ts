import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';
import { insertCourseToCalendar } from '@/lib/google';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  if (!courseId) return;

  const session = await getServerAuthSession();
  const userId = session.user.id;

  const course = await prisma.course.findFirst({
    where: { id: courseId },
  });
  if (!course) return;

  // Insert course to external calendar
  await insertCourseToCalendar(userId, course);

  return NextResponse.redirect(new URL(`/?courseId=${courseId}`, request.url));
}
