FROM node:18-alpine as builder

ENV HUSKY 0

WORKDIR /app

COPY package*.json .
COPY prisma ./prisma/

RUN npm ci 

COPY . .

RUN npm run build

FROM node:18-alpine as runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY --chown=node:node --from=builder \
    ./app/package*.json \
    ./app/tsconfig.json \
    ./
COPY --chown=node:node --from=builder ./app/node_modules ./node_modules
COPY --chown=node:node --from=builder ./app/src ./src
COPY --chown=node:node --from=builder ./app/prisma ./prisma   
COPY --chown=node:node --from=builder ./app/.next ./.next


CMD ["npm", "run", "start:migrate"]
