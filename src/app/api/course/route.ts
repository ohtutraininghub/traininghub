import { NextResponse, NextRequest } from 'next/server';
import { courseSchema } from '@/lib/zod/courses';
import { prisma } from '@/lib/prisma/prisma';
import { Tag } from '@prisma/client';

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

    return NextResponse.json({ data: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
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
