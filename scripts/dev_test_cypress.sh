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
dotenv -e .env.test -- npx prisma migrate dev --skip-seed
if [ $? -ne 0 ]; then
  echo ""
  echo "You're likely missing .env.test file."
  echo "Check docs/CONTRIBUTING.md!"
  echo ""
  exit 1
fi

dotenv -e .env.test -- npx cypress open $ARGS &
dotenv -e .env.test -- npx next dev

# When quit from watch "normally"
docker compose -f docker-compose.test.yml down