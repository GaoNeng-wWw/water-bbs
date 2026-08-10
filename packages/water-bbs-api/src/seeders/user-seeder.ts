import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Account, Identifier, Profile } from '../auth';
import { randomBytes } from 'crypto';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const identifier = await em.findOne(Identifier, {
      identValue: 'admin@no-reply.com',
    });
    if (identifier !== null) {
      console.log(`Admin Account exists`);
      return;
    }
    const profile = new Profile();
    profile.nick = 'Admin';
    profile.bio = '';
    const account = new Account();
    const pwd = randomBytes(256).toString('hex').toString().slice(0, 16);
    profile.accountId = account.id;
    account.addIdentifier('email', 'admin@no-reply.com');
    account.addCredential('password', pwd);
    await em.upsert(Profile, profile);
    await em.upsert(Account, account);
    console.log('Email: admin@no-reply.com');
    console.log(`Password: ${pwd}`);
  }
}
