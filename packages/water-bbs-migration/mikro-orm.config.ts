import { defineConfig } from "@mikro-orm/mysql";
import * as dotenv from "dotenv";
import {
  Account,
  Permission,
  Role,
  Cert,
  Ident,
  Profile,
  Category,
  Thread,
  Post,
  Reply,
  FileReference,
  Proposals,
  Vote,
  VoteAction,
  VoteSlot,
  ProposalComment,
  Action,
  Resource,
  ResourceOwnerMap,
  Wallet,
  TransactionDetail,
  TransferLog,
  Subject,
  Policy,
  Task,
  TaskReward,
  UserTask,
  Reward
} from "./entities";
import { Migrator } from "@mikro-orm/migrations";
import { SeedManager } from "@mikro-orm/seeder";

dotenv.config({ path: process.env.DOTENV_PATH || ".env" });

export default defineConfig({
  extensions: [Migrator, SeedManager],
  seeder: {
    defaultSeeder: "DatabaseSeeder",
    fileName: () => "database-seeder.ts",
  },
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  dbName: "water-bbs",
  migrations: {
    path: "./migrations",
    tableName: "migrations",
    pathTs: "./migrations",
    transactional: false,
    fileName(timestamp, name) {
      return `migration-${timestamp}`;
    },
  },
  entities: [
    Account,
    Permission,
    Role,
    Cert,
    Ident,
    Profile,
    Category,
    Thread,
    Post,
    Reply,
    FileReference,
    Proposals,
    Vote,
    VoteSlot,
    ProposalComment,
    Action,
    Resource,
    ResourceOwnerMap,
    Wallet,
    TransactionDetail,
    TransferLog,
    Subject,
    Policy,
    Task,
    TaskReward,
    UserTask,
    Reward
  ],
  debug: true,
});
