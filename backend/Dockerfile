FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

FROM base
COPY --from=install /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001
CMD ["bun", "run", "src/main.ts"]
