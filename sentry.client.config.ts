// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const environment =
  process.env.SENTRY_ENVIRONMENT ??
  process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ??
  'development';
const isDevEnv = environment === 'development';

Sentry.init({
  dsn: 'https://cd9962ee2976ee9852cca9e3c16e5d41@o4506626307457024.ingest.sentry.io/4506626317746176',

  environment: environment,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.2,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  // debug: isDevEnv,

  // Comments this line if testing is required in development environment
  enabled: !isDevEnv,
});
