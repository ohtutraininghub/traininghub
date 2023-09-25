# Contributing

Idea of this file is to provide necessary information for:
* Setting up development environment
* How the contribution flow goes

## Getting started

This getting started sections helps you setup and start development environment.

### 1 Install required dependencies

* [Node](https://nodejs.org/en/download)
* [Docker](https://docs.docker.com/engine/install/)

### 2 Setup env file

Add `.env` file with following content to the project's root
```
# Required by Prisma
DATABASE_URL="postgresql://admin:password@localhost:5433/traininghub-db-dev?schema=public"

# Needed for psql Docker image
POSTGRES_USER="admin"
POSTGRES_PASSWORD="password"
```

### 3 Install 

1. At project's root directory `npm install`
2. Build and start database container with `docker compose up -d --build`
3. Handle database migrations `npx prisma migrate dev`
4. Stop container `docker compose down`

> **_Note_:**  To access psql CLI in the container run `docker exec -it postgres psql -U admin traininghub-db-dev`

### Start project locally

1. Run the database container `docker compose up -d --build`
2. Start the Next.js dev environment `npm run dev`

### Stop project locally

1. CTRL + C in terminal
2. `docker compose down`

## Contribution flow

### New features and fixes

1. Create an issue for fix or feature
   * Put label `task`, and assign it to current sprint in backlog
2. Create new branch from `staging` branch
   * Naming convention for new branch is `#{issue number}/{fix/feat}/{optionally additional information}`
   * E.g. `#11/fix/duplicate-courses` or `#45/feat/add-courses`
3. Move task to `In Progress` in backlog, then do required changes and push the new branch
   * Tests are required, refer to [definition of done](./definition-of-done.md)
4. Create pull request against `staging` branch
   * Assign someone from project to review it, and wait for approval
5. After pull request is approved, merge it and delete the merged branch

> **_Note_:**  All changes made to `staging` are merged to `main` branch before meeting the client

### Reviewing pull request

This helps to identify what to look for when reviewing pull request.
Most importantly pull request should be linked to task or set of tasks.

* Code quality
  * When reading code you should not have to ask yourself what does this do
  * No hard limit for file length, but when it goes over 250 it might be time to split its functionalities
  * Code should be splitted to appropriate folders
    * `app`: should not contain much logic, only usage of folders `components` and `lib`
    * `components`: any UI components required by `app`
    * `lib`: utilities, third party libs, etc.
* TypeScript
  * Should not use `any` type unless it has good reason
  * Imports should use module path aliases defined in `ts.config.json` section `paths`
    * E.g. `import { Button } from '../../../components/button'` --> `import { Button } from '@/components/button'`
* Form validation
  * Form validation should use Zod library
  * Schema is only defined once and its used in frontend and backend (api folder)
* UI
  * The styling should follow same format as other parts of site
  * No hardcoded colors, use theme
  * UI should be responsive
  * Errors should be handled, and the user informed of them (without sensitive data)
* Tests
  * Feature has meaningful tests which cover edgecases
  * Components and utilities require Jest tests
* Documentation
  * Code itself should be documented (or refactored) if you have to ask yourself what does this do
  * If changes to code affect anything in `docs` folder, they should be updated
* Security
  * Should trainer or user be able to access this, if not is it prevented?
  * No sensitive information in git or logs
* Performance
  * Middleground between poorly optimized code and complex algorithms is usually good enough

### Branching

There are two main branches `main` and `staging`. Main branch is for production. Staging branch
is mostly for developers to test new features in very similar environment as production without the
fear of breaking important things. Here is simple diagram to show branching flow:
```mermaid
graph TD;
    A[New feature or fix branch] -->|Merge| B[Staging Branch];
    B -->|Merge| C[Main Branch];
    C -->|Deploy| D[Production];
    B -->|Deploy| E[Staging];
```

### Good to know

#### Prisma migrations in development

1. After any changes to schema. Run `npx prisma migrate dev`, and follow the instructions.
2. If the schema migration also requires data migrations, you'll have to edit the generated migration
   * For example model `user` had `image` column which is moved to model `user_information` as `profile_image` column. In this case you would have to modify the `migration.sql` to insert `image` column data to `profile_image` column for correct user id.
3. Push the generated migration to git