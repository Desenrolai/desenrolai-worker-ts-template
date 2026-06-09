# ─── builder ───────────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# ─── runtime ───────────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

# Non-root user for security
RUN addgroup --system --gid 1001 worker && \
    adduser --system --uid 1001 --ingroup worker worker

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

USER worker

# Worker connects to Redis via REDIS_URL env var.
# No HTTP port is exposed — this is a Deployment without a Service/Ingress.
CMD ["node", "dist/index.js"]
