import { Entity, PrimaryKey, Property, ManyToOne, Unique, Enum } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';  
import { AccountEntity } from './account';

export enum IdentEnum {
  EMAIL = 'Email',
}

@Entity()
@Unique({ properties: ['identType', 'identValue', 'account'] })
export class IdentEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Enum(() => IdentEnum)
  @Property({ index: true, nullable: false })
  identType!: IdentEnum;

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  identValue!: string;

  @Property({ default: false })
  verified: boolean = false;

  @ManyToOne(() => AccountEntity)
  account!: AccountEntity;
}

export enum CertEnum {
  PASSWORD = 'Password',
}

@Entity()
export class CertEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Enum(() => CertEnum)
  @Property({ index: true, nullable: false })
  certType!: CertEnum;

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  certValue!: string;

  @ManyToOne(() => AccountEntity)
  account!: AccountEntity;
}