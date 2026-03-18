# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

COPY src/main/package*.json ./
RUN npm install --omit=dev
COPY src/main/ ./

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:18-alpine

LABEL maintainer="Venkata Pavan Kumar Utpala <23FE10CSE00388>"
LABEL description="Puppet Report Dashboard - CSE3253 DevOps Project"
LABEL version="1.0.0"

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app ./

RUN mkdir -p logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

CMD ["node", "server.js"]
