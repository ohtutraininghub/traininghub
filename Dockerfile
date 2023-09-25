FROM node:18-alpine

ENV HUSKY 0
ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "start:migrate"]