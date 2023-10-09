# Take additional args passed
ARGS=$1

# Start and build if there is changes
# Started as background task
npm run test:docker

# Loop every 1s until Postgres has fully started
DATABASE_CONTAINER="postgres-test"
until docker exec $DATABASE_CONTAINER pg_isready ; do sleep 1 ; done

# When CTRL + C close database
trap "docker compose -f docker-compose.test.yml down" INT TERM

# Run database migrations
npx prisma migrate dev --skip-seed

npm run test:watch $ARGS

# When quit from watch "normally"
docker compose -f docker-compose.test.yml down