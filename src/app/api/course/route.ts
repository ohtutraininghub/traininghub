import { NextResponse, NextRequest } from 'next/server';
import { courseSchema, courseSchemaWithId } from '@/lib/zod/courses';
import {
  StatusCodeType,
  errorResponse,
  successResponse,
} from '@/lib/response/responseUtil';
import { prisma } from '@/lib/prisma';
import { Tag } from '@prisma/client';
import { handleCommonErrors } from '@/lib/response/errorUtil';
import { getServerAuthSession } from '@/lib/auth';
import { hasCourseEditRights, isTrainerOrAdmin } from '@/lib/auth-utils';
import { updateCourseToCalendars } from '@/lib/google';

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
    const { user } = await getServerAuthSession();
    if (!isTrainerOrAdmin(user)) {
      return errorResponse({
        message: 'Forbidden',
        statusCode: StatusCodeType.FORBIDDEN,
      });
    }
    const data = await request.json();
    const body = courseSchema.parse(data);
    const parsedTags = await parseTags(body.tags);
    await prisma.course.create({
      data: {
        ...body,
        createdById: user.id,
        tags: {
          connect: parsedTags.map((tag) => ({ id: tag.id })),
        },
      },
    });

    return successResponse({
      message: 'Course successfully created!',
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user } = await getServerAuthSession();
    const body = courseSchemaWithId.parse(await request.json());
    const parsedTags = await parseTags(body.tags);
    const course = await prisma.course.findFirst({
      where: { id: body.id },
    });
    if (!course) {
      return errorResponse({
        message: 'Course not found',
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }
    if (!hasCourseEditRights(user, course)) {
      return errorResponse({
        message: 'Forbidden',
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
      message: 'Course successfully updated!',
      statusCode: StatusCodeType.OK,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}
