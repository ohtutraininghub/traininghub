# Install depencies
npm install

# Start and build database
docker compose up -d --build

# Loop every 1s until Postgres has fully started
DATABASE_CONTAINER="postgres-dev"
until docker exec $DATABASE_CONTAINER pg_isready ; do sleep 1 ; done

# Reset database, apply migrations and run seed scripts
npx prisma migrate reset

# Stop the container
docker compose down