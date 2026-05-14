import { defineConfig } from '@mikro-orm/mysql';
import * as dotenv from 'dotenv';
import { Account, Ident, Cert, Permission, Role, Profile, Post, Thread, Reply } from './entities';


import { Migrator } from '@mikro-orm/migrations';

dotenv.config({ path: process.env.DOTENV_PATH || '.env' });

export default defineConfig({
    extensions: [Migrator],
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    dbName: 'water-bbs',
    migrations:{
        path: './migrations',
        tableName: 'migrations',
        pathTs: './migrations',
        transactional: false,
    },
    entities:[
        Account,
        Ident,
        Cert,
        Permission,
        Role,
        Profile,
        Post, Thread, Reply
    ],
    debug: true,
})