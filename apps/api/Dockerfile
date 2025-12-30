# Multi-stage Dockerfile for NestJS API
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
COPY apps/api ./apps/api
COPY libs ./libs
COPY scripts ./scripts
# Build the API (webpack generates package.json in dist/apps/api with bundled dependencies)
RUN pnpm nx build api --configuration=production

# Stage 4: Production runtime
FROM node:22-alpine AS production
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy built application (webpack generates package.json in dist with runtime deps)
COPY --from=build /workspace/dist/apps/api ./dist

# Install only production dependencies from webpack-generated package.json
# Webpack's generatePackageJson creates a minimal package.json with only runtime dependencies
WORKDIR /app/dist
RUN pnpm install --frozen-lockfile --prod --no-optional
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/main.js"]

