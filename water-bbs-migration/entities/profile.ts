import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/decorators/legacy';
import { BaseMetaEntity } from './meta';
import { AccountEntity } from './account';

@Entity()
export class ProfileEntity extends BaseMetaEntity {
  @OneToOne(() => AccountEntity, account => account.profile, { primary: true, owner: true })
  account!: AccountEntity;

  @Property({ nullable: false, type: 'text' })
  name!: string;

  @Property({ nullable: true, type: 'text' })
  bio?: string;

  @Property({ nullable: true, type: 'text' })
  avatar?: string;
}