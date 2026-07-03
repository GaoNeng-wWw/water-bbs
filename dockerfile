FROM node:22-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN corepack enable

FROM base as builder

WORKDIR /usr/src/app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm i --frozen-lockfile --ignore-scripts=false

RUN rm -rf pnpm-workspace.yaml && \
    mv pnpm-workspace.prod.yaml pnpm-workspace.yaml
    pnpm run -r build && \
    pnpm deploy --filter water-bbs-api ./deploy/water-bbs-api && \
    pnpm deploy --filter water-bbs-web ./deploy/water-bbs-web && \
    pnpm deploy --filter water-bbs-migration ./deploy/water-bbs-migration

FROM base as migration

WORKDIR /app

COPY --from=builder /usr/src/app/deploy/water-bbs-migration .

CMD ["pnpm", "migration:up"]

FROM base as seeder

WORKDIR /app

COPY --from=builder /usr/src/app/deploy/water-bbs-migration .

CMD ["pnpm", "seed:run"]

FROM base as api

COPY --from=builder /usr/src/app/deploy/water-bbs-api .

CMD ["pnpm", "run start"]