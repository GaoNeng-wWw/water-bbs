import { defineConfig } from '@mikro-orm/core';
import { database } from './configs/config.json';
import { SqliteDriver } from '@mikro-orm/sqlite';

export default defineConfig({
  host: process.env.DB_HOST ?? database.host,
  user: process.env.DB_USER ?? database.user,
  password: process.env.DB_PASSWORD ?? database.pass,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : database.port,
  dbName: process.env.DB_DBNAME ?? database.db,
  driver: SqliteDriver,
});
