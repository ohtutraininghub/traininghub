# TrainingHub

An application for displaying available trainings for company's employees. Users can view and enroll to available trainings they are interested in.

## Links

- [Product backlog](https://github.com/orgs/ohtutraininghub/projects/3/views/1)
- [Deployed staging app](https://traininghub-staging-6e39b40e512f.herokuapp.com/)
- [Deployed production app](https://traininghub-7db9b0b9243c.herokuapp.com/)

## Getting Started

### Install

1. Install node & docker
2. At project's root directory `npm install`
3. Build database container with `docker compose up -d --build`
4. Handle migrations `npx prisma migrate dev`
5. Stop container `docker compose down`

### Start

1. Start the Next.js dev environment `npm run dev`
2. Run the database container `docker compose up -d`

### Stop

1. CTRL + C in terminal
2. `docker compose down`
