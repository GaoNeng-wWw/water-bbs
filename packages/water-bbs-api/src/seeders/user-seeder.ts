import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Account, Identifier, Profile } from '../auth';
import { randomBytes } from 'crypto';
import {
  SYSTEM_WALLET_ID,
  Transaction,
  TransactionStatus,
  Wallet,
} from '@app/gamification';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const identifier = await em.findOne(Identifier, {
      identValue: 'admin@no-reply.com',
    });
    const profile = new Profile();
    profile.nick = 'Admin';
    profile.bio = '';
    const account = new Account();
    const pwd = randomBytes(256).toString('hex').toString().slice(0, 16);
    profile.accountId = account.id;
    account.addIdentifier('email', 'admin@no-reply.com');
    account.addCredential('password', pwd);
    if (!identifier) {
      await em.upsert(Profile, profile);
      await em.upsert(Account, account);
      console.log('Email: admin@no-reply.com');
      console.log(`Password: ${pwd}`);
    }
    if (identifier) {
      const adminWallet = await em.findOne(Wallet, {
        id: identifier.account.id,
      });
      if (!adminWallet) {
        const wallet = em.create(Wallet, {
          id: identifier.account.id,
          balanceSnapshot: '10000',
        });
        const transcation = em.create(Transaction, {
          from: SYSTEM_WALLET_ID,
          to: identifier.account.id,
          amount: '10000',
          status: TransactionStatus.Success,
          detail: '',
        });
        await em.upsert(Wallet, wallet);
        await em.upsert(Transaction, transcation);
      }
    }
  }
}
