# ---------- BASE IMAGE ----------
FROM node:22-alpine AS base

RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app

# ---------- DEPENDENCIES INSTALL ----------
FROM base AS deps

COPY package.json ./
RUN npm install

# ---------- BUILD ----------
FROM deps AS builder

COPY . .
RUN npm run build

# ---------- PRODUCTION ----------
FROM node:22-alpine AS production

WORKDIR /app

# Copy runtime deps only
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Use non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001
USER appuser

EXPOSE 3333
CMD ["npm", "start"]
