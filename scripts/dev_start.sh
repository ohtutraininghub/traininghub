# Go back to root
cd ..

# When CTRL + C close database
trap "docker compose down" SIGINT SIGTERM

# Start and build database, and build if there is changes
docker compose up -d --build

# Start the project
npm run dev