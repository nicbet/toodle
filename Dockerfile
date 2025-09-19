# Multi-stage build for production-grade React app

# Stage 1: Build the app
FROM oven/bun:latest AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN bun run build

# Stage 2: Serve with Bun
FROM oven/bun:latest

ENV NODE_ENV=production

# Copy built files
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
# Set working directory
WORKDIR /app

RUN bun install --frozen-lockfile

# Expose the port from environment
EXPOSE $PORT

# Set default environment variables
ENV PORT=3000

# Start Bun server
CMD ["bun", "run", "serve"]