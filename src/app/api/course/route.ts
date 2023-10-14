import { NextResponse, NextRequest } from 'next/server';
import { courseSchema } from '@/lib/zod/courses';
import { prisma } from '@/lib/prisma/prisma';
import { Tag } from '@prisma/client';
import { StatusCodeType, successResponse } from '@/lib/response/responseUtil';
import { handleCommonErrors } from '@/lib/response/errorUtil';

export async function GET() {
  const courses = await prisma.course.findMany();
  return NextResponse.json({ data: courses }, { status: StatusCodeType.OK });
}

export async function POST(request: NextRequest) {
  try {
    const data = await parseRequest(request);
    const { name, description, startDate, endDate, maxStudents, tags } =
      courseSchema.parse(data);
    const parsedTags = await parseTags(tags);
    await prisma.course.create({
      data: {
        name,
        description,
        startDate,
        endDate,
        maxStudents,
        tags: {
          connect: parsedTags?.map((tag) => ({ id: tag.id })) || [],
        },
      },
    });

    return successResponse({
      message: 'Course succesfully created!',
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}

const parseTags = async (tags: string[]): Promise<Tag[]> => {
  let allTags = await prisma.tag.findMany();
  return allTags.filter((e) => tags.includes(e.name));
};

/* A helper function to determine whether the request is from the server or the client:
return the request.json() if the request is from the client and else return the given arguments directly */

const parseRequest = async (request: NextRequest) => {
  try {
    return await request.json();
  } catch (error) {
    if (error instanceof TypeError) {
      return request;
    } else {
      throw error;
    }
  }
};
