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

1. Run the database container `docker compose up -d`
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