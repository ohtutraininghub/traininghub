# Setup .env file if not exists for development
ENV_FILE=.env
if [ ! -f $ENV_FILE ]; then
  DATABASE_URL=postgresql://admin:password@localhost:5433/traininghub-db-dev?schema=public
  NEXTAUTH_SECRET=$(openssl rand -base64 32)
  NEXTAUTH_URL=http://localhost:3000
  HOST_URL=http://localhost:3000
  API_AUTH_TOKEN=$(openssl rand -base64 32)

  echo "# Required for Prisma" > $ENV_FILE
  echo "DATABASE_URL=$DATABASE_URL" >> $ENV_FILE
  echo "" >> $ENV_FILE
  echo "# Required for NextAuth" >> $ENV_FILE
  echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> $ENV_FILE
  echo "NEXTAUTH_URL=$NEXTAUTH_URL" >> $ENV_FILE
  echo "" >> $ENV_FILE
  echo "# Required for Slack" >> $ENV_FILE
  echo "SLACK_BOT_TOKEN=" >> $ENV_FILE
  echo "HOST_URL=$HOST_URL" >> $ENV_FILE
  echo "" >> $ENV_FILE
  echo "# Required for authenticating API calls" >> $ENV_FILE
  echo "API_AUTH_TOKEN=$API_AUTH_TOKEN" >> $ENV_FILE
fi

# Setup .env.test file if not exists for development
ENV_TEST_FILE=.env.test
if [ ! -f $ENV_TEST_FILE ]; then
  DATABASE_URL=postgresql://admin:password@localhost:5434/traininghub-db?schema=public
  NEXTAUTH_SECRET=$(openssl rand -base64 32)
  NEXTAUTH_URL=http://localhost:3000
  API_AUTH_TOKEN=$(openssl rand -base64 32)

  echo "# Required for Prisma" > $ENV_TEST_FILE
  echo "DATABASE_URL=$DATABASE_URL" >> $ENV_TEST_FILE
  echo "" >> $ENV_TEST_FILE
  echo "# Required for NextAuth" >> $ENV_TEST_FILE
  echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> $ENV_TEST_FILE
  echo "NEXTAUTH_URL=$NEXTAUTH_URL" >> $ENV_TEST_FILE
  echo "" >> $ENV_TEST_FILE
  echo "# Required for authenticating API calls" >> $ENV_TEST_FILE
  echo "API_AUTH_TOKEN=$API_AUTH_TOKEN" >> $ENV_TEST_FILE
fi

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