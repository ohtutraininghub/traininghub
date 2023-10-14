import { NextResponse, NextRequest } from 'next/server';
import { courseSchema, courseSchemaWithId } from '@/lib/zod/courses';
import {
  StatusCodeType,
  errorResponse,
  successResponse,
} from '@/lib/response/responseUtil';
import { prisma } from '@/lib/prisma/prisma';
import { handleCommonErrors } from '@/lib/response/errorUtil';

export async function GET() {
  const courses = await prisma.course.findMany();
  return NextResponse.json({ data: courses }, { status: StatusCodeType.OK });
}

export async function POST(request: NextRequest) {
  try {
    const dataJson = await request.json();
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

export async function PUT(request: NextRequest) {
  try {
    const body = courseSchemaWithId.parse(await request.json());
    const course = await prisma.course.findFirst({
      where: { id: body.id },
    });
    if (!course) {
      return errorResponse({
        message: 'Course not found',
        statusCode: StatusCodeType.NOT_FOUND,
      });
    }
    await prisma.course.update({ where: { id: body.id }, data: body });
    return successResponse({
      message: 'Course succesfully updated!',
      statusCode: StatusCodeType.OK,
    });
  } catch (error) {
    return handleCommonErrors(error);
  }
}
