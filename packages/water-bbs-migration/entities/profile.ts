import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/decorators/legacy';
import { BaseMetaEntity } from './meta';
import { Account } from './account';

@Entity()
export class Profile extends BaseMetaEntity {
  @OneToOne(() => Account, account => account.profile, { primary: true, owner: true })
  account!: Account;

  @Property({ nullable: false, type: 'text' })
  name!: string;

  @Property({ nullable: true, type: 'text' })
  bio?: string;

  @Property({ nullable: true, type: 'text' })
  avatar?: string;

  constructor(
    account: Account,
    name: string,
    bio?: string,
    avatar?: string,
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