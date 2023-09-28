# Start and build if there is changes
# Started as background task
npm run dev:docker

# When CTRL + C close database
trap "docker compose down" INT TERM

# Start the project in terminal
npm run dev:next