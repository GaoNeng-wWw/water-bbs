#!/bin/sh
set -e


if [ "$RUN_MIGRATION" = "true" ]; then
  echo "Running migrations..."
  pnpm orm migration:up --run
  exit $?
fi

if [ "$RUN_SEEDER" = "true" ]; then
  echo "Running seeders..."
  pnpm orm seeder:run
  exit $?
fi

pnpm orm migration:up --run
exec pnpm start