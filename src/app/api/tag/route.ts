import { NextRequest, NextResponse } from 'next/server';
import { tagSchema, TagSchemaType } from '@/lib/zod/tags';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  let newTag: TagSchemaType | undefined;
  try {
    const reqData = await request.json();
    newTag = tagSchema.parse(reqData);
    await prisma.tag.create({
      data: newTag,
    });
    return NextResponse.json({ data: newTag }, { status: 201 });
  } catch (error: unknown) {
    let errorMessage = 'Failed to create tag. ';
    let statusCode = 500;
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      errorMessage += 'Tag "' + newTag?.name + '" already exists.';
      statusCode = 422;
    }
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
