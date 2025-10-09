# Logger Package Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build the package
RUN npm run build

# Create a minimal image with built package
FROM node:20-alpine AS package

WORKDIR /app

# Copy built package
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/README.md ./

# Install only production dependencies
RUN npm ci --only=production

# Create a volume for this package to be shared
VOLUME ["/app"]

CMD ["echo", "Logger package built successfully"]