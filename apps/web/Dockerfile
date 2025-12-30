# Multi-stage Dockerfile for Next.js Web App
# Stage 1: Base dependencies
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /workspace

# Stage 2: Install dependencies
FROM base AS deps
COPY pnpm-lock.yaml package.json ./
COPY nx.json tsconfig.base.json ./
# Copy only necessary files for dependency resolution
COPY libs/shared/types/package.json ./libs/shared/types/
RUN pnpm install --frozen-lockfile

# Stage 3: Build application
FROM deps AS build
# Copy source code and configuration
COPY apps/web ./apps/web
COPY libs ./libs
# Set build-time environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# Build the Next.js app
RUN pnpm nx build web

# Stage 4: Production runtime
FROM node:22-alpine AS production
WORKDIR /app

# Copy built Next.js application from dist
# Nx Next.js build outputs to dist/apps/web
COPY --from=build /workspace/dist/apps/web ./

# Copy node_modules (Next.js may use standalone mode or require full node_modules)
# If standalone mode is enabled, node_modules will be minimal in the dist output
# Otherwise, copy from build stage
COPY --from=build /workspace/node_modules ./node_modules

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the Next.js production server
# Nx Next.js builds output to dist/apps/web
# Use next start if server.js doesn't exist (non-standalone mode)
CMD sh -c "if [ -f server.js ]; then node server.js; else node_modules/.bin/next start; fi"

