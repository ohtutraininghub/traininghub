import { NextRequest } from 'next/server';
import { tagSchema, TagSchemaType } from '@/lib/zod/tags';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  StatusCodeType,
  successResponse,
  errorResponse,
} from '@/lib/response/responseUtil';
import { handleCommonErrors } from '@/lib/response/errorUtil';

export async function POST(request: NextRequest) {
  let newTag: TagSchemaType | undefined;
  try {
    const reqData = await request.json();
    newTag = tagSchema.parse(reqData);
    await prisma.tag.create({
      data: newTag,
    });
    return successResponse({
      message: `Tag \"${newTag.name}\" succesfully created!`,
      statusCode: StatusCodeType.CREATED,
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return errorResponse({
        message:
          'Failed to create tag. Tag "' + newTag?.name + '" already exists.',
        statusCode: StatusCodeType.UNPROCESSABLE_CONTENT,
      });
    }
    return handleCommonErrors(error);
  }
}
