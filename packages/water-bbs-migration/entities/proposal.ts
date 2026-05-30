import { Entity, Enum, PrimaryKey, Property, Unique } from "@mikro-orm/decorators/legacy";
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
  @PrimaryKey({ type: 'uuid', default: v7() })
  id: string;

  @Property({ index: true, type: 'uuid' })
  authorId: string;
  @Property({ index: true, type: 'text', default: ''})
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

  constructor(
    id: string,
    authorId: string,
    content: string,
    command: string,
    startAt: Date,
    endAt: Date,
  ){
    super();
    this.id=id;
    this.authorId=authorId;
    this.content=content;
    this.command=command;
    this.startAt=startAt;
    this.endAt=endAt;
  }

  static create(
    authorId: string,
    comment: string,
    command: string, startAt: Date, endAt: Date){
    return new Proposals(v7(), authorId, comment, command, startAt, endAt);
  }

  remove(){
    this.removedAt = new Date();
  }
}

@Entity()
@Unique({ properties: ['proposalId', 'accountId'] })
export class Vote extends BaseMetaEntity {
  @PrimaryKey({ type: 'uuid', default: v7() })
  id: string;

  @Property({ index: true, type: 'uuid' })
  proposalId: string;

  @Property({ index: true, type: 'uuid' })
  accountId: string;

  @Enum(() => VoteAction)
  action: VoteAction;

  @Property({type: 'text', default: ''})
  // 回复
  comment: string;

  constructor(
    id: string,
    proposalId: string,
    accountId: string,
    action: VoteAction,
    comment: string,
  ){
    super();
    this.id=id;
    this.proposalId=proposalId;
    this.accountId=accountId;
    this.action=action;
    this.comment=comment;
  }
  static create(proposal: Proposals, accountId: string, action: VoteAction, comment?: string){
    return new Vote(v7(), proposal.id, accountId, action, comment || '');
  }
}

@Entity()
export class VoteSlot {
  @Property({type:'uuid', default: v7()})
  id: string;
  @Property({type: 'uuid'})
  voteId: string;
  @Property({type: 'uuid'})
  proposalId: string;
  @Property({type: 'int'})
  slot: number;
  @Property({type: 'int'})
  cnt: number = 0;

  constructor(
    voteId: string,
    proposalId: string,
    slot: number,
  ){
    this.voteId=voteId;
    this.proposalId=proposalId;
    this.slot=slot;
  }

  static create(
    voteId: string,
    proposalId: string,
    slot: number,
  ){
    return new VoteSlot(voteId, proposalId, slot);
  }
}

export enum VoteAction {
  Yes = 'yes',
  No = 'no'
}