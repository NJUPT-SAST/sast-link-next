# Stage 1: Build
FROM node:20-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

# Build-time env vars - override via --build-arg or compose args
# Use ARG so callers can inject values via `--build-arg` or docker-compose build args.
ARG NEXT_PUBLIC_API_BASE_URL=https://link.sast.fun/apis
ARG NEXT_PUBLIC_API_MOCKING=false
# Expose the build args as ENV for the runtime image layer that follows the build
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_API_MOCKING=${NEXT_PUBLIC_API_MOCKING}

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Stage 2: Serve
FROM caddy:alpine

COPY --from=builder /app/out /var/www
COPY container.Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
