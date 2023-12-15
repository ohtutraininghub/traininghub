import { captureException } from '@sentry/nextjs';

/**
 * Used to capture exceptions which aren't critical for the whole operation.
 * They can and should be handled whenever they appear to Sentry.
 *
 * As an example this is used with Google calendar functions. We don't
 * want to throw 'Internal server error' because Google event edit failed.
 * Instead just capture the error and fix/silence it, and let the enrollment pass properly.
 */
export const logHandledException = (error: Error) => captureException(error);
