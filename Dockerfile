FROM node:22-alpine AS base
RUN npm install -g pnpm@10
WORKDIR /app

# نسخ ملفات الـ dependencies أولاً
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/ ./lib/
COPY artifacts/api-server/package.json ./artifacts/api-server/package.json
COPY artifacts/english-learn/package.json ./artifacts/english-learn/package.json
COPY scripts/ ./scripts/

# تثبيت جميع الـ dependencies
RUN pnpm install --frozen-lockfile

# نسخ باقي الكود
COPY . .

# بناء الواجهة الأمامية
RUN BASE_PATH=/ pnpm --filter @workspace/english-learn run build

# بناء الـ API
RUN pnpm --filter @workspace/api-server run build

# نظّف dependencies التطوير
RUN pnpm prune --prod

EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "artifacts/api-server/dist/index.mjs"]
