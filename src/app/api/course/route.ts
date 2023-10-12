import { NextResponse, NextRequest } from 'next/server';
import { courseSchema } from '@/lib/zod/courses';
import { prisma } from '@/lib/prisma/prisma';
import { StatusCodeType, successResponse } from '@/lib/response/responseUtil';
import { handleCommonErrors } from '@/lib/response/errorUtil';

export async function GET() {
  const courses = await prisma.course.findMany();
  return NextResponse.json({ data: courses }, { status: StatusCodeType.OK });
}

export async function POST(request: NextRequest) {
  try {
    const dataJson = await parseRequest(request);
    const dataJsonParse = courseSchema.parse(dataJson);
    await prisma.course.create({
      data: dataJsonParse,
    });
    return successResponse({
      message: 'Course succesfully created!',
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}

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
