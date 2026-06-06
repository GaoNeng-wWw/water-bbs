import { Entity, PrimaryKey, Property, ManyToOne, Unique, Enum } from '@mikro-orm/decorators/legacy';
import { v7 } from 'uuid';  
import { Account } from './account';
import { hashSync, compareSync } from 'bcryptjs';

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

  static create(
    identType: IdentEnum,
    identValue: string,
    account: Account,
  ){
    return new Ident({ identType, identValue, account });
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
    this.certValue = hashSync(this.certValue, 10);
  }

  static create(
    certType: CertEnum,
    certValue: string,
    account: Account,
  ){
    return new Cert({ certType, certValue, account });
   }

  comparePassword(plainPassword: string){
    return compareSync(plainPassword, this.certValue);
  }
}