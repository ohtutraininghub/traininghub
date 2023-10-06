import { NextResponse, NextRequest } from 'next/server';
import { courseSignupSchema } from '@/lib/zod/courses';
import { prisma } from '@/lib/prisma/prisma';
import { getServerAuthSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerAuthSession();

  try {
    const data = await request.json();
    const courseId = courseSignupSchema.parse(data);

    if (!session) {
      throw Error('Could not find session');
    }

    const course = await prisma.course.findFirst({
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
      where: { id: courseId },
    });

    if (!course) {
      throw Error('Could not find course');
    }

    if (course._count.students >= course.maxStudents) {
      throw Error('Course is already full');
    }

    await prisma.courseUser.create({
      data: {
        userId: session.user.id,
        courseId: courseId,
      },
    });
    return NextResponse.json({ data: 'created' }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
