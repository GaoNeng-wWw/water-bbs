FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
ENV COREPACK_NPM_REGISTRY=https://registry.npmmirror.com

RUN npm config set registry https://registry.npmmirror.com

RUN corepack enable

FROM base as build

LABEL maintainer="water-bbs-org"

WORKDIR /app

COPY . /app/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN cp ./packages/water-bbs-api/src/configs/config.example.json ./packages/water-bbs-api/src/configs/config.json && pnpm run -r build
RUN pnpm deploy --legacy --filter ./packages/water-bbs-api --prod /prod/water-bbs-api
RUN pnpm deploy --legacy --filter ./packages/water-bbs-web --prod /prod/water-bbs-web

FROM base as api

ENV DB_HOST=""
ENV DB_USER=""
ENV DB_PASSWORD=""
ENV DB_PORT=""
ENV DB_DBNAME=""

COPY --from=build /prod/water-bbs-api /app

FROM api as api_prod

VOLUME [ "/app/dist/configs", "/app/dist/lua", "/app/dist/templates", "/app/dist/translation" ]

LABEL volume.configs.path="/app/dist/configs" \
      volume.configs.description="应用配置文件目录" \
      volume.configs.default_mode="read-only" \
      volume.lua.path="/app/dist/lua" \
      volume.lua.description="Redis Lua 脚本扩展目录" \
      volume.templates.path="/app/dist/templates" \
      volume.templates.description="邮件ejs模板" \
      volume.translation.path="/app/dist/translation" \
      volume.translation.description="翻译文件目录"

LABEL env.DB_HOST.required="true" \
      env.DB_HOST.desc="数据库地址" \
      env.DB_USER.required="true" \
      env.DB_USER.desc="数据库用户名" \
      env.DB_PASSWORD.required="true" \
      env.DB_PASSWORD.desc="数据库密码" \
      env.DB_PORT.required="true" \
      env.DB_PORT.desc="数据库端口" \
      env.DB_DBNAME.required="true" \
      env.DB_DBNAME.desc="数据库名" \
      env.RUN_MIGRATION.desc="是否只执行迁移" \
      env.RUN_MIGRATION.required="true" \
      env.RUN_MIGRATION.default="false" \
      env.RUN_SEEDER.desc="是否只初始化数据" \
      env.RUN_SEEDER.required="true" \
      env.RUN_SEEDER.default="false"

COPY mikro-orm.config.ts .

ENTRYPOINT ["/entrypoint.sh"]

CMD ["pnpm", "start"]

FROM base as web

COPY --from=build /prod/water-bbs-web/dist /app

FROM nginx:alpine AS web_prod
ENV API_ADDR="water-bbs-api:3000"
LABEL env.API_ADDR.required="true" \
      env.API_ADDR.desc="后端地址" \
      env.API_ADDR.required="false"
COPY --from=web /app /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80