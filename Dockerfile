FROM node:21-alpine as builder

# Passed in workflow via docker_build_args
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG SENTRY_ENVIRONMENT
ARG NEXT_PUBLIC_SENTRY_ENVIRONMENT
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG API_AUTH_TOKEN

# Change args to env so build can use them properly...
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT
ENV NEXT_PUBLIC_SENTRY_ENVIRONMENT=$NEXT_PUBLIC_SENTRY_ENVIRONMENT
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV SENTRY_ORG=$SENTRY_ORG
ENV SENTRY_PROJECT=$SENTRY_PROJECT
ENV HOST_URL=$HOST_URL
ENV SLACK_BOT_TOKEN=$SLACK_BOT_TOKEN
ENV API_AUTH_TOKEN=$API_AUTH_TOKEN

# Add required static envs for build
ENV HUSKY 0
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY . .

# Why libc6: https://github.com/nodejs/docker-node/tree/ce9bfa282b62ece538fef25b954ade4401a7c8c7#nodealpine
RUN apk add --no-cache libc6-compat && \
  npm ci && \
  npm run build

FROM node:21-alpine as runner

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
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

CMD ["npm", "run", "start:migrate"]