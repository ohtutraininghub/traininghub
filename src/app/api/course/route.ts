import { PrismaClient } from '@prisma/client';
import { NextResponse, NextRequest } from 'next/server';
import { courseSchema } from '@/schemas';

const prisma = new PrismaClient();

interface Course {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
}

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

export async function POST(req: Course) {
  try {
    const data = courseSchema.parse(req);
    await prisma.course.create({ data: data });
    return NextResponse.json({ data: req }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Course) {
  try {
  } catch (error) {}
}

export async function PUT(req: Course) {
  try {
  } catch (error) {}
}
