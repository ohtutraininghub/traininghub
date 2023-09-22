FROM node:18-alpine

ARG DATABASE_URL

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build

CMD ["npm", "run", "start:migrate"]