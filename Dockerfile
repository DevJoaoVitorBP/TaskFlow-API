FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

# ── Development stage ─────────────────────────────────────────────────────────
FROM base AS development

RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"]

# ── Builder stage ──────────────────────────────────────────────────────────────
FROM base AS builder

RUN npm ci --only=production

COPY . .

RUN npm run build

# ── Production stage ───────────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3333

CMD ["node", "dist/server.js"]
