FROM node:18-alpine as builder

# Add required static envs for build
ENV HUSKY 0
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY . .

# Why libc6: https://github.com/nodejs/docker-node/tree/ce9bfa282b62ece538fef25b954ade4401a7c8c7#nodealpine
RUN apk add --no-cache libc6-compat && \ 
  npm ci && \ 
  npm run build

FROM node:18-alpine as runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Add nodejs group and nextjs user as non root
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

CMD ["npm", "run", "start:migrate"]