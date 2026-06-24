import { Entity, Enum, PrimaryKey, Property, Unique } from "@mikro-orm/decorators/legacy";
import { DomainError, err, ok } from 'water-bbs-shared';
import { v7 } from "uuid";
import { BaseMetaEntity } from "./meta";

export enum ProposalStatus {
  // 活跃中
  Active = 'active',
  // 已通过
  Passed = 'passed',
  // 被拒绝
  Rejected = 'rejected',
  // 执行中
  Executed = 'executed',
  // 取消
  Cancelled = 'cancelled'
}

@Entity()
export class Proposals extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid',  })
  id: string;
  @Property({ type: 'text', default: ''})
  title: string;
  @Property({ index: true, type: 'uuid' })
  authorId: string;
  @Property({ type: 'text', default: ''})
  content: string;

  // 序列化后的JSON
  @Property({ type: 'text' })
  command: string;

  @Property({ type: 'datetime' })
  startAt: Date;

  @Property({ type: 'datetime' })
  endAt: Date;

  @Enum(() => ProposalStatus)
  status: ProposalStatus = ProposalStatus.Active;

  @Property({ type: 'decimal', precision: 5, scale: 2, default: 50.00 })
  approvalPercent: number;

  @Property({ type: 'text', default: ''})
  reason: string;

  @Property({ type: 'text', default: ''})
  executor_id: string;

  @Property({ type: 'number' })
  deposit:number;

  constructor(
    id: string,
    authorId: string,
    content: string,
    command: string,
    startAt: Date,
    endAt: Date,
    title: string,
    deposite: number,
  ){
    super();
    this.title = title;
    this.id=id;
    this.authorId=authorId;
    this.content=content;
    this.command=command;
    this.startAt=startAt;
    this.endAt=endAt;
    this.deposit = deposite;
  }

  run(){
    if (this.status !== ProposalStatus.Active){
      return err(new DomainError('PROPOSAL_IS_NOT_ACTIVE'));
    }
    this.status = ProposalStatus.Executed;
    return ok(true);
  }
  done(){
    if (this.status !== ProposalStatus.Executed){
      return err(new DomainError('PROPOSAL_IS_NOT_EXECUTED'));
    }
    this.status = ProposalStatus.Passed;
    return ok(true);
  }
  reject(executor_id?: string, reason?: string){
    if (this.status !== ProposalStatus.Executed){
      return err(new DomainError('PROPOSAL_IS_NOT_EXECUTED'));
    }
    this.status = ProposalStatus.Rejected;
    this.reason = reason || '';
    this.executor_id = executor_id ?? '';
    return ok(true);
  }
  cancel(executor_id: string, reason?: string){
    if (this.status !== ProposalStatus.Executed){
      return err(new DomainError('PROPOSAL_IS_NOT_EXECUTED'));
    }
    this.status = ProposalStatus.Cancelled;
    this.reason = reason || '';
    this.executor_id = executor_id;
    return ok(true);
  }
  static create(
    authorId: string,
    comment: string,
    command: string, startAt: Date, endAt: Date, title: string,
    deposite: number
  ){
    return new Proposals(v7(), authorId, comment, command, startAt, endAt, title, deposite);
  }

  remove(){
    this.removedAt = new Date();
  }
}

@Entity()
@Unique({ properties: ['proposalId', 'accountId'] })
export class Vote extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid',  })
  id: string;

  @Property({ index: true, type: 'uuid' })
  proposalId: string;

  @Property({ index: true, type: 'uuid' })
  accountId: string;

  @Enum(() => VoteAction)
  action: VoteAction;

  constructor(
    id: string,
    proposalId: string,
    accountId: string,
    action: VoteAction,
  ){
    super();
    this.id=id;
    this.proposalId=proposalId;
    this.accountId=accountId;
    this.action=action;
  }
  static create(
    proposalId: string,
    accountId: string,
    action: VoteAction,
  ){
    return new Vote(v7(), proposalId, accountId, action);
  }
}

@Entity()
export class VoteSlot {
  @PrimaryKey({ type: 'uuid',  })
  id: string;
  @Property({type: 'uuid'})
  voteId: string;
  @Property({type: 'uuid'})
  proposalId: string;
  @Property({type: 'int'})
  slot: number;
  @Property({type: 'int'})
  cnt: number = 1;
  @Enum(() => VoteAction)
  action: VoteAction;

  constructor(
    voteId: string,
    proposalId: string,
    slot: number,
    action: VoteAction,
  ){
    this.voteId=voteId;
    this.proposalId=proposalId;
    this.slot=slot;
    this.action = action
  }

  static create(
    voteId: string,
    proposalId: string,
    slot: number,
    action: VoteAction,
  ){
    return new VoteSlot(voteId, proposalId, slot, action);
  }
  static getSlots(){
    return Math.floor(Math.random() * 32 );
  }
}

@Entity()
export class ProposalComment extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid',  })
  id: string;
  @Property({type: 'uuid'})
  proposalId: string;
  @Property({type: 'uuid'})
  accountId: string;
  @Property({type: 'text', default: ''})
  comment: string;
  @Enum(() => VoteAction)
  @Property({type: 'text', default: '', nullable: true})
  action?: VoteAction;

  constructor(
    id: string,
    proposalId: string,
    accountId: string,
    comment: string,
    action?: VoteAction,
  ){
    super();
    this.id=id;
    this.proposalId=proposalId;
    this.accountId=accountId;
    this.comment=comment;
    this.action=action;
  }
  static build(
    proposalId: string,
    accountId: string,
    comment: string,
    action?: VoteAction,
  ){
    return new ProposalComment(v7(), proposalId, accountId, comment, action);
  }
}

export enum VoteAction {
  Yes = 'yes',
  No = 'no'
}