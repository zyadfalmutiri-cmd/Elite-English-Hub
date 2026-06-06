FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY lib/ ./lib/
COPY artifacts/ ./artifacts/
COPY tsconfig.base.json tsconfig.json ./
RUN pnpm install --frozen-lockfile || pnpm install

# Build client
WORKDIR /app/artifacts/client
RUN pnpm run build

# Build server
WORKDIR /app/artifacts/api-server
RUN pnpm run build

# Production stage
FROM node:20-slim AS production
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

COPY --from=base /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=base /app/tsconfig.base.json /app/tsconfig.json ./
COPY --from=base /app/lib/ ./lib/
COPY --from=base /app/artifacts/ ./artifacts/
COPY --from=base /app/node_modules/ ./node_modules/

EXPOSE 8080
CMD ["node", "artifacts/api-server/dist/index.mjs"]
