# Analytics Service - NestJS Application with TimescaleDB support
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat postgresql-client
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Build stage for TypeScript/NestJS
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN apk add --no-cache postgresql-client
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 analyticsservice

# Copy dependencies and built application
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder --chown=analyticsservice:nodejs /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

USER analyticsservice

EXPOSE 5006

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5006/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/main.js"]
