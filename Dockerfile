FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --include=dev --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# Prisma only needs a syntactically valid URL while generating its client.
# Render injects the real internal DATABASE_URL into the running container.
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/opspilot
ENV GITHUB_WEBHOOK_SECRET=container-build-placeholder
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 10000
ENV PORT=10000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
