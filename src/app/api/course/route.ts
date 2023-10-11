import { NextResponse, NextRequest } from 'next/server';
import { courseSchema } from '@/lib/zod/courses';
import { prisma } from '@/lib/prisma';
import { StatusCodeType, successResponse } from '@/lib/response/responseUtil';
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


