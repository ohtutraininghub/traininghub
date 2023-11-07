import { captureException } from '@sentry/nextjs';

/**
 * Only use case of this should be for example when looping through
 * list and you don't want to let one error break the whole loop.
 */
export const logHandledException = (error: any) => captureException(error);
