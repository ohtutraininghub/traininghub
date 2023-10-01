import { NextResponse, NextRequest } from 'next/server';
import { courseSchema } from '@/lib/zod/courses';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany();
    return NextResponse.json({ data: courses }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await parseRequest(request);
    const dataToSchema = courseSchema.parse(data);
    await prisma.course.create({ data: dataToSchema });
    return NextResponse.json({ data: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
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
