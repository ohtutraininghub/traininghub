import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';

const prisma = new PrismaClient();

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
  let res = null;
  //undefined for tests
  if (request.json == undefined) {
    res = request;
    //else for CourseForm
  } else {
    res = await request.json();
  }
  try {
    const newCourse = await prisma.course.create({
      data: res,
    });
    return NextResponse.json({ data: newCourse }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
  } catch (error) {}
}

export async function PUT(request: NextRequest) {
  try {
  } catch (error) {}
}
