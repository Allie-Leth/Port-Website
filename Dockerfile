# Multi-stage Dockerfile for Next.js Portfolio
# Optimized for production deployment

# Dependencies stage
# Use Node 22 with npm 11.x for patched dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
# Update npm to 11.x to patch CVE-2024-21538 and CVE-2025-64756
RUN npm install -g npm@latest
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Builder dependencies stage (includes devDependencies)
# Use Node 22 with npm 11.x for patched dependencies
FROM node:22-alpine AS builder-deps
RUN apk add --no-cache libc6-compat
# Update npm to 11.x to patch CVE-2024-21538 and CVE-2025-64756
RUN npm install -g npm@latest
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Build stage
# Use Node 22 with npm 11.x for patched dependencies
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
# Update npm to 11.x to patch CVE-2024-21538 and CVE-2025-64756
RUN npm install -g npm@latest
WORKDIR /app

# Copy dependencies from builder-deps stage (has all deps including devDependencies)
COPY --from=builder-deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_GRAFANA_URL
ARG NEXT_PUBLIC_GITLAB_URL
ARG GHOST_URL
ARG GHOST_API_KEY

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV GHOST_URL=${GHOST_URL}
ENV GHOST_API_KEY=${GHOST_API_KEY}

# Build the application
RUN npm run build

# Production stage
# Use Node 22 with npm 11.x for patched dependencies
FROM node:22-alpine AS production
# Update npm to 11.x to patch CVE-2024-21538 and CVE-2025-64756
RUN npm install -g npm@latest
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start the application
CMD ["node", "server.js"]