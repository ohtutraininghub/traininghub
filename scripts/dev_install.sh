# Go back to root
cd ..

# Install depencies
npm install

# Start and build database
docker compose up -d --build

# Run database migrations
npx prisma migrate dev

# Stop the container
docker compose down