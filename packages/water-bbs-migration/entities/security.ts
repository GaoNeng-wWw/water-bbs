import { Entity, PrimaryKey, Property, ManyToOne, Unique, Enum } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';  
import { Account } from './account';

export enum IdentEnum {
  EMAIL = 'Email',
}

@Entity()
@Unique({ properties: ['identType', 'identValue', 'account'] })
export class Ident {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Enum(() => IdentEnum)
  @Property({ index: true, nullable: false })
  identType!: IdentEnum;

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  identValue!: string;

  @Property({ default: false })
  verified: boolean = false;

  @ManyToOne(() => Account)
  account!: Account;

  constructor(
    data?: Partial<Ident>
  ){
    Object.assign(this, data);
  }

  isVerify(){
    return this.verified;
  }
  verify(){
    this.verified = true;
  }
}

export enum CertEnum {
  PASSWORD = 'Password',
}

@Entity()
export class Cert {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Enum(() => CertEnum)
  @Property({ index: true, nullable: false })
  certType!: CertEnum;

  @Property({ index: true, nullable: false, type: 'char', length: 255 })
  certValue!: string;

  @ManyToOne(() => Account)
  account!: Account;

  constructor(
    data?: Partial<Cert>
  ){
    Object.assign(this, data);
  }
}