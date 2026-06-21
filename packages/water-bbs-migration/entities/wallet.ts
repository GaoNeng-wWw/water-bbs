import { Embeddable, Embedded, Entity, Index, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { BaseMetaEntity } from "./meta";
import { v7 } from "uuid";

@Entity()
export class Wallet {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property({ type: 'uuid', index: true, nullable: false })
  accountId: string;

  @Property({ type: 'decimal', precision: 18, scale: 2, nullable: false })
  balance: string;

  @Property({ type: 'bigint', default: 0, version: true })
  version: number; 

  constructor(
    id: string,
    accountId: string,
    balance: string,
    version: number
  ){
    this.id = id;
    this.accountId = accountId;
    this.balance = balance;
    this.version = version;
  }
  static create(
    accountId: string,
    balance: string,
    version: number
  ){
    return new Wallet(v7(), accountId, balance, version);
  }
}

@Entity()
@Index({ properties: ['from', 'createdAt'] })
@Index({ properties: ['to', 'createdAt'] })
export class TransferLog extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string;
  @Property({ type: 'decimal', precision: 18, scale: 2, nullable: false })
  amount: string;

  @Embedded(() => TransactionDetail)
  transactionDetail: TransactionDetail;
  @Embedded(()=>Subject)
  from: Subject;
  @Embedded(()=>Subject)
  to: Subject;

  constructor(
    id: string,
    amount: string,
    transactionDetail: TransactionDetail,
    from: Subject,
    to: Subject,
  ){
    super();
    this.id = id
    this.amount = amount
    this.transactionDetail = transactionDetail
    this.from = from
    this.to = to
  }

  static create(
    amount: string,
    transactionDetail: TransactionDetail,
    from: Subject,
    to: Subject,
  ){
    return new TransferLog(
      v7(),
      amount,
      transactionDetail,
      from,
      to
    )
  }
}

@Embeddable()
export class TransactionDetail {
  @Property({ type: 'text' })
  type: string;
  @Property({ type: 'json' })
  args: Record<string, string>;
  constructor(
    type: string,
    args: Record<string, string>
  ){
    this.type = type;
    this.args = args;
  }
}

@Embeddable()
export class Subject {
  @Property({ type: 'boolean' })
  private system: boolean;
  @Property({ nullable: true })
  private accountId?: string;

  constructor(
    system: boolean,
    accountId?: string
  ){
    this.system = system;
    this.accountId = accountId;
  }

  getAccountId(){
    if (this.system) {
      return null;
    }
    return this.accountId!;
  }
}