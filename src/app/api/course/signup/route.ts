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

    const userCourseIds = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        courses: {
          select: {
            id: true,
          },
        },
      },
    });

    if (userCourseIds?.courses.find((course) => course.id === courseId)) {
      throw Error('User is already in course');
    }

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        students: {
          connect: {
            id: session.user.id,
          },
        },
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
