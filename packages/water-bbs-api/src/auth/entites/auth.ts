import { MetaEntity } from '@app/shared';
import { Cascade, Collection, type Opt } from '@mikro-orm/core';
import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { v7 } from 'uuid';

export type IdentifierId = string & { readonly __brand: unique symbol };
export type CredentialId = string & { readonly __brand: unique symbol };
export type AccountId = string & { readonly __brand: unique symbol };

@Entity({ tableName: 'identifier' })
export class Identifier extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<IdentifierId> = v7() as IdentifierId;
  @Property({ type: 'text' })
  identType: string;
  @Property({ type: 'longtext' })
  identValue: string;
  @Property({ type: 'boolean' })
  verified: boolean;
  @OneToMany(() => Credential, (cred) => cred.identifier, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    orphanRemoval: true,
    eager: false,
  })
  credentials = new Collection<Credential>(this);
}

const hash = (value: string, salt: string) =>
  pbkdf2Sync(value, salt, 1000, 18, 'sha256').toString('hex');

@Entity({ tableName: 'credential' })
export class Credential extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<CredentialId> = v7() as CredentialId;
  @Property({ type: 'text' })
  credentialType: string;
  @Property({ type: 'longtext' })
  credentialValue: string;
  @ManyToOne(() => Identifier, { hidden: true })
  identifier!: Identifier;
  @Property({ type: 'text' })
  salt: Opt<string> = randomBytes(256).toString('hex').toLowerCase();

  isSameCredentialValue(plain: string) {
    return hash(plain, this.salt) === this.credentialValue;
  }
  @BeforeCreate()
  hashCredentialValue() {
    this.credentialValue = hash(this.credentialValue, this.salt);
  }
}

@Entity({ tableName: 'account' })
export class Account extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<AccountId> = v7() as AccountId;
  @Property({ type: 'uuid' })
  identifier_id: IdentifierId;

  @OneToOne(() => Profile, (profile) => profile.account, {
    mappedBy: 'account',
  })
  profile?: Profile;
}

export type ProfileId = string & { readonly __brand: unique symbol };

@Entity({ tableName: 'profile' })
export class Profile extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  accountId: AccountId;

  @Property()
  nick: string;

  @Property({ nullable: true })
  bio?: string;

  @OneToOne(() => Account)
  account: Account;
}
