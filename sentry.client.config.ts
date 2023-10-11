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
  dsn: 'https://81239b413f81f52390fe6a803d2e82de@o4506016471777280.ingest.sentry.io/4506016471842816',

  environment: environment,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.2,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  // debug: isDevEnv,

  // Comments this line if testing is required in development environment
  enabled: !isDevEnv,
});
