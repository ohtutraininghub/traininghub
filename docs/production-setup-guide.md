# Production setup guide

Idea of this file is to provide necessary information for:

- Setting up testing, staging and production environment in new Github repo

## Things you'll need

These accounts are required to setup this project.
It's easier to create one Google account handle all accounts.

#### Google

Google setup is required for Google sign in and Google calendar usage.

Follow the instructions in [Google's documentation on setting up OAuth 2.0 credentials](https://support.google.com/cloud/answer/6158849).

- Library
  - Enable Google Calendar API
- Credentials (OAuth 2.0 Client IDs)
  - Example authorized JavaScript origins in development environment: `http://localhost:3000`
  - Example authorized redirect URIs in development envinronment: `http://localhost:3000/api/auth/callback/google`
  - Here you can find secrets `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` which will be required by GitHub Actions
- OAuth consent screen
  - Scopes:
    - `/auth/userinfo.email`
    - `/auth/userinfo.profile`
    - `openid`
    - `/auth/calendar.events.owned`
  - Test Users: add emails which are allowed in testing

#### Sentry

[Sentry](https://sentry.io/) is required for error tracking.

Before continuing know that Sentry has already been setup for this project.
You will need to change DSN in configs and obtain `SENTRY_AUTH_TOKEN`.

- Create new Sentry project
- Obtain the DSN during creation
  - Change Sentry configs DNSs to new one (at root `sentry.client.config.ts`, `sentry.edge.config.ts` and `sentry.server.config.ts`)
- Create Sentry [auth token](https://docs.sentry.io/product/accounts/auth-tokens/) which will be required by GitHub Actions

#### Heroku

`HEROKU_API_KEY`, `HEROKU_EMAIL` are required, use Google.  
`HEROKU_APP_NAME` is required for both staging and production.

`HEROKU_APP_NAME` is the name of the application without the URL hash, for example: `> **traininghub-staging**-7db9b0b9243c.herokuapp.com`
For production, `staging` is not needed.

#### PostgreSQL

`DATABASE_URL` is required for staging and production, use any provider. Heroku offers PostgreSQL with the app.  
Example: `postgresql://admin:password@localhost:5433/traininghub-db?schema=public`

#### Slack

Slack setup is required for sending messages to Slack.

- Create new [Slack app](https://api.slack.com/) from scratch
- Slack App settings
  - Features
    - OAuth & Permissions
      - Add Bot Token Scopes:
        - `channels:read`
        - `channels:manage`
        - `chat:write`
        - `users:read`
        - `users:read.email`
      - Install app to workspace
      - Now you can obtain `Bot User OAuth Token` for `SLACK_BOT_TOKEN`.
- In workspace, create new channel `new-trainings` (name can be modified in [constants.ts](https://github.com/ohtutraininghub/traininghub/blob/staging/src/lib/slack/constants.ts))
  - View channel details
    - Integrations
      - Add Slack app to the channel

## GitHub secrets

#### Repository secrets

`GOOGLE_CLIENT_ID`: refer to Google setup  
`GOOGLE_CLIENT_SECRET`: refer to Google setup

`HEROKU_API_KEY`: refer to Heroku setup  
`HEROKU_EMAIL`: refer to Heroku setup

`NEXTAUTH_SECRET`: e.g. run command openssl rand -base64 32

`SENTRY_AUTH_TOKEN`: refer to Sentry setup  
`SENTRY_ORG`: defined when creating Sentry project  
`SENTRY_PROJECT`: defined when creating Sentry project

`API_AUTH_TOKEN`: e.g. run command openssl rand -base64 32 (This is used to authenticate the api call from [reminder workflow](https://github.com/ohtutraininghub/traininghub/actions/workflows/reminder.yml))
`REMINDER_API_URL`: production URL/api/reminder e.g. "https://production.com/api/reminder"

### Environments

This projects uses GitHub [environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) in actions.

#### staging

`DATABASE_URL`: refer to PostgreSQL setup  
`HEROKU_APP_NAME`: refer to Heroku setup  
`NEXTAUTH_URL`: staging URL, refer to Heroku setup  
`HOST_URL`: staging URL, refer to Heroku setup  
`SLACK_BOT_TOKEN`: refer to Slack setup

#### production

`DATABASE_URL`: refer to PostgreSQL setup  
`HEROKU_APP_NAME`: refer to Heroku setup  
`NEXTAUTH_URL`: production URL, refer to Heroku setup  
`HOST_URL`: production URL, refer to Heroku setup  
`SLACK_BOT_TOKEN`: refer to Slack setup
