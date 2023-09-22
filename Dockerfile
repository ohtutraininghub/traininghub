FROM node:18-alpine

ARG DATABASE_URL

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma migrate deploy

COPY . .

RUN npm run build

CMD ["npm", "start"]