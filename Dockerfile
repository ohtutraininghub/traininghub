FROM node:18-alpine

ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:migrate"]