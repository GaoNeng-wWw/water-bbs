import { Entity, PrimaryKey, Property, OneToOne, Index, Embedded } from '@mikro-orm/decorators/legacy';
import { BaseMetaEntity } from './meta';
import { Account } from './account';
import { FileReference } from './file-ref';
import { Cascade } from '@mikro-orm/core';

@Entity()
export class Profile extends BaseMetaEntity {
  @OneToOne(() => Account, account => account.profile, { primary: true, owner: true })
  account!: Account;

  @Property({ nullable: false, type: 'text' })
  name!: string;

  @Property({ nullable: true, type: 'text' })
  bio?: string;

  @OneToOne(() => FileReference, { nullable: true, owner: true, eager: true, cascade: [Cascade.PERSIST, Cascade.REMOVE]})
  avatar?: FileReference;

  constructor(
    account: Account,
    name: string,
    bio?: string,
    avatar?: FileReference,
  ){
    super()
    this.account = account;
    this.name = name;
    if (bio) {
      this.bio = bio;
    }
    if (avatar) {
      this.avatar = avatar;
    }
  }
}