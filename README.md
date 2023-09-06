# TrainingHub
 
## Getting Started

### Install

1. Install docker & node
2. At project's root directory `npm install`
3. Create `.env` file according to `.env.example`
4. `docker compose -f docker-compose.dev.yml up -d --build`
5. `npx prisma migrate dev`
6. `docker compose -f docker-compose.dev.yml down`

### Start

1. `docker compose -f docker-compose.dev.yml up -d --build`
2. `npm run dev`

### Stop

1. `docker-compose -f docker-compose.dev.yml down`
2. CTRL + C in terminal
