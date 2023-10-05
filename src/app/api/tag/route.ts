import { NextRequest, NextResponse } from 'next/server';
import { tagSchema } from '@/lib/zod/tags';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const reqData = await request.json();
    const newTag = tagSchema.parse(reqData);
    await prisma.tag.create({
      data: newTag,
    });
    return NextResponse.json({ data: newTag }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
