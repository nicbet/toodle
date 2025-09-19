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

# Stage 2: Serve with Caddy
FROM caddy:alpine

# Copy built files to Caddy
COPY --from=builder /app/dist /usr/share/caddy

# Copy Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Expose ports 80, 443, 5000 (Caddy will use both or just 5000 based on configuration)
EXPOSE 80 443 5000

# Set default environment variables
ENV APP_DOMAIN=localhost
ENV BEHIND_LOAD_BALANCER=false
ENV PORT=5000

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]