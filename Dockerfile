FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN echo asdd ${DATABASE_URL}

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:migrate"]