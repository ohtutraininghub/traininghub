import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { messageResponse, MessageType, StatusCodeType } from './responseUtil';

/**
 * Used in routes to handle common errors.
 *
 * IMPORTANT: has to be last handler in catch. Example route
 * @example
 * export async function POST(request: NextRequest) {
 *   try {
 *     const data = await request.json()
 *     handleData(data)
 *     return messageResponse({
 *       message: 'Success',
 *       messageType: MessageType.SUCCESS,
 *       statusCode: StatusCodeType.CREATED,
 *     });
 *   } catch (error) {
 *     // Route specific error handlers
 *     if (error instanceof UncommonError) {
 *       const handledError = handleUncommonError(error)
 *       return messageResponse({
 *         message: handledError.message,
 *         messageType: MessageType.ERROR,
 *         statusCode: StatusCodeType.BAD_REQUEST,
 *       });
 *     }
 *     // Always last handler for error
 *     return handleCommonErrors(error);
 *   }
 * }
 */
export const handleCommonErrors = (error: unknown): NextResponse => {
  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  // If not known error throw it for error handler
  throw error;
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
