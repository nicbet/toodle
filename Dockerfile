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
# --- Serve stage ---
FROM caddy:2-alpine
COPY --from=builder /app/dist /usr/share/caddy