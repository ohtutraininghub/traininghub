import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const courses = await prisma.course.findMany();
    return NextResponse.json({
      data: courses,
    });
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: { body: any; }) {
  try {
    const { body } = request;
    const newCourse = await prisma.course.create( {
      data: body,
    })
    return NextResponse.json({
      data: newCourse
    })
  } catch (error) {
    return NextResponse.error();
  }
}
