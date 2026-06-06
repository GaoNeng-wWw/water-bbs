import { Seeder } from "@mikro-orm/seeder";
import { Account, Cert, CertEnum, Ident, IdentEnum, Profile, Role } from "../entities";
import { randomBytes } from 'crypto';
import { Collection, EntityManager } from "@mikro-orm/core";
import { BUILTIN_ROLES } from "./role-seeder";

const pwd = randomBytes(32).toString('base64')
const ident = new Ident({
  identType: IdentEnum.EMAIL,
  identValue: 'admin@no-reply.com',
  verified: false,
})
const cert = new Cert({
  certType: CertEnum.PASSWORD,
  certValue: pwd,
})

export class AccountSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('AccountSeeder run');
    if (await em.findOne(Account,{
      idents:{
        identType: ident.identType,
        identValue: ident.identValue,
      }
    })) {
      return;
    }
    const role = await em.findOneOrFail(Role, {
      code: BUILTIN_ROLES[0]
    });
    const account = new Account();
    const profile = new Profile(account, 'admin');
    account.role = role;
    account.profile = profile;
    account.addIdentity(ident);
    account.addCert(cert);
    await em.upsert(Account, account);
    console.log('AccountInfo');
    console.log('Email:', ident.identValue);
    console.log('Password:', pwd);
  }
}