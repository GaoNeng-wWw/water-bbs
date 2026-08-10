import { defineConfig } from '@mikro-orm/core';
import { database } from './src/configs/config.json';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { Account, Credential, Identifier, Profile } from './src/auth';
import { Category } from './src/category';
import { Reply, Topic } from './src/topic';
import { SeedManager } from '@mikro-orm/seeder';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  host: process.env.DB_HOST ?? database.host,
  user: process.env.DB_USER ?? database.user,
  password: process.env.DB_PASSWORD ?? database.pass,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : database.port,
  dbName: process.env.DB_DBNAME ?? database.db,
  driver: SqliteDriver,
  entities: [Identifier, Credential, Account, Profile, Category, Topic, Reply],
  extensions: [SeedManager, Migrator],
});
