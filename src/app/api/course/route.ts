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
    //const data = await parseRequest(request);
    const data = await request.json();
    const dataToSchema = courseSchema.parse(data);
    await prisma.course.create({ data: dataToSchema });
    return NextResponse.json({ data: dataToSchema }, { status: 201 });
  } catch (error) {
    let errorMessage = 'Internal Server Error: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
