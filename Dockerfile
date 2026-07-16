# ─────────────────────────────────────────────────────────────────────────────
# TaskFlow API - Multi-stage Docker Build
# ─────────────────────────────────────────────────────────────────────────────

# ── Base stage - Common setup ──────────────────────────────────────────────────
FROM node:22-alpine AS base

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# ── Dependencies stage - Install all deps ──────────────────────────────────────
FROM base AS dependencies

RUN npm ci

# ── Development stage - Full dev environment ──────────────────────────────────
FROM dependencies AS development

COPY . .

RUN npm run prisma:generate

EXPOSE 3333

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev"]

# ── Builder stage - Build production code ─────────────────────────────────────
FROM dependencies AS builder

COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Build TypeScript
RUN npm run build

# ── Production stage - Minimal runtime image ──────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
