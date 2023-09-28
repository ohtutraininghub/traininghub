# Start and build if there is changes
# Started as background task
npm run dev:docker

# Loop every 1s until Postgres has fully started
DATABASE_CONTAINER="postgres-dev"
until docker exec $DATABASE_CONTAINER pg_isready ; do sleep 1 ; done

# When CTRL + C close database
trap "docker compose down" INT TERM

# Start the project in terminal
npm run dev:next