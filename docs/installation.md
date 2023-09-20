### Installation - dev environment

#### Env file

Env file needs to have a password for PostgreSQL and a connection string for prisma

Example .env file could look like such:

```md
# Required by prisma
DATABASE_URL="postgresql://admin:password@localhost:5433/traininghub-db-dev?schema=public"

# Needed for psql docker image
POSTGRES_USER="admin"
POSTGRES_PASSWORD="password"
```


#### Setting up

1. Install node & docker
2. At project's root directory `npm install`
3. Build database container with `docker compose up -d --build`
4. Handle migrations `npx prisma migrate dev`
5. Stop container `docker compose down`

> **_Note_:**  To access psql CLI in the container run `docker exec -it postgres psql -U admin traininghub-db-dev`

### Start

1. Run the database container `docker compose up -d`
2. Start the Next.js dev environment `npm run dev`

### Stop

1. CTRL + C in terminal
2. `docker compose down`
