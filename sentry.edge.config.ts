// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
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
