# Multi-stage build for API
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../packages/logger/package*.json ../packages/logger/

# Install dependencies
RUN npm ci --only=production

# Build logger package
FROM base AS logger-builder
WORKDIR /app
COPY ../packages/logger ../packages/logger
WORKDIR /app/packages/logger
RUN npm ci && npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs appuser

# Copy built logger package
COPY --from=logger-builder --chown=appuser:nodejs /app/packages/logger/dist /app/packages/logger/dist
COPY --from=logger-builder --chown=appuser:nodejs /app/packages/logger/package.json /app/packages/logger/

# Copy node_modules and application code
COPY --from=deps --chown=appuser:nodejs /app/node_modules /app/node_modules
COPY --chown=appuser:nodejs . .

# Create logs directory
RUN mkdir -p /app/logs && chown appuser:nodejs /app/logs

USER appuser

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["npm", "start"]