import { MetaEntity } from '@app/shared';
import { Cascade, Collection, type Opt } from '@mikro-orm/core';
import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { v7 } from 'uuid';

export type IdentifierId = string & {
  readonly __brand: unique symbol;
};

export type CredentialId = string & {
  readonly __brand: unique symbol;
};

export type AccountId = string & {
  readonly __brand: unique symbol;
};

/**
 * 用户主体
 */
@Entity({
  tableName: 'account',
})
export class Account extends MetaEntity {
  @PrimaryKey({
    type: 'uuid',
  })
  id: Opt<AccountId> = v7() as AccountId;

  /**
   * 用户绑定的身份
   */
  @OneToMany(() => Identifier, (identifier) => identifier.account, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    orphanRemoval: true,
  })
  identifiers = new Collection<Identifier>(this);

  /**
   * 用户认证凭证
   */
  @OneToMany(() => Credential, (credential) => credential.account, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
    orphanRemoval: true,
  })
  credentials = new Collection<Credential>(this);

  addIdentifier(type: string, value: string) {
    const identifier = Identifier.create(this, type, value);

    this.identifiers.add(identifier);

    return identifier;
  }

  addCredential(type: string, value: string) {
    const credential = Credential.create(this, type, value);

    this.credentials.add(credential);

    return credential;
  }
}

/**
 * 身份标识
 *
 * email
 * phone
 * github
 */
@Entity({
  tableName: 'identifier',
})
export class Identifier extends MetaEntity {
  @PrimaryKey({
    type: 'uuid',
  })
  id: Opt<IdentifierId> = v7() as IdentifierId;

  @Property({
    type: 'text',
  })
  identType: string;

  @Property({
    type: 'longtext',
  })
  identValue: string;

  @Property({
    type: 'boolean',
  })
  verified: boolean = false;

  @ManyToOne(() => Account, {
    hidden: true,
  })
  account!: Account;

  private constructor(account: Account, type: string, value: string) {
    super();

    this.account = account;
    this.identType = type;
    this.identValue = value;
  }

  static create(account: Account, type: string, value: string) {
    return new Identifier(account, type, value);
  }
}

const hash = (value: string, salt: string) =>
  pbkdf2Sync(value, salt, 1000, 32, 'sha256').toString('hex');

/**
 * 登录凭证
 *
 * password
 * otp
 * passkey
 */
@Entity({
  tableName: 'credential',
})
export class Credential extends MetaEntity {
  @PrimaryKey({
    type: 'uuid',
  })
  id: Opt<CredentialId> = v7() as CredentialId;

  @Property({
    type: 'text',
  })
  credentialType: string;

  @Property({
    type: 'longtext',
  })
  credentialValue: string;

  @Property({
    type: 'text',
  })
  salt: string = randomBytes(32).toString('hex');

  @ManyToOne(() => Account, {
    hidden: true,
  })
  account!: Account;

  private constructor(account: Account, type: string, value: string) {
    super();

    this.account = account;
    this.credentialType = type;
    this.credentialValue = value;
  }

  static create(account: Account, type: string, value: string) {
    return new Credential(account, type, value);
  }

  @BeforeCreate()
  hashCredentialValue() {
    this.credentialValue = hash(this.credentialValue, this.salt);
  }

  verify(plain: string) {
    return hash(plain, this.salt) === this.credentialValue;
  }
}

export type ProfileId = string & {
  readonly __brand: unique symbol;
};

@Entity({
  tableName: 'profile',
})
export class Profile extends MetaEntity {
  @PrimaryKey({
    type: 'uuid',
  })
  accountId!: AccountId;

  @Property({
    type: 'text',
  })
  nick: string;

  @Property({
    type: 'text',
    nullable: true,
  })
  bio?: string;
}
