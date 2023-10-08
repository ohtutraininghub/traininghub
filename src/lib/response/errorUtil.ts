import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { messageResponse, MessageType, StatusCodeType } from './responseUtil';

export const handleCommonErrors = (
  error: unknown
): NextResponse | undefined => {
  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  return undefined;
};

const handleZodError = (error: ZodError) => {
  // Get all Zod issues, map them to end with dot
  // Then join all issues into single string
  const errorMessage = error.issues
    .map((issue) =>
      issue.message.endsWith('.') ? issue.message : `${issue.message}.`
    )
    .join(' ');

  return messageResponse({
    message: errorMessage,
    messageType: MessageType.ERROR,
    statusCode: StatusCodeType.BAD_REQUEST,
  });
};
