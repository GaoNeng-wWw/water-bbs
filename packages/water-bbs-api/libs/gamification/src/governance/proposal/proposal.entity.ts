import { type Opt } from '@mikro-orm/core';
import {
  Embeddable,
  Entity,
  Enum,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/decorators/legacy';
import { err, ok } from 'neverthrow';
import { type AccountId } from 'src/auth';
import { v7 } from 'uuid';
import { StatusError } from './error';
import { MetaEntity } from '@app/shared';

export type ProposalId = string & { readonly __brand: unique symbol };
export const createProposalId = () => v7() as ProposalId;

export type ProposalVoteId = string & { readonly __brand: unique symbol };
export const createProposalVoteId = () => v7() as ProposalVoteId;

export type VoteId = string & { readonly __brand: unique symbol };
export const createVoteId = () => v7() as VoteId;

export type StepId = string & { readonly __brand: unique symbol };
export const createStepId = () => v7() as StepId;

export enum ProposalStatus {
  Pending = 'pending',
  Controversy = 'controversy',
  Approved = 'approved',
  Rejected = 'rejected',
  Executing = 'executing',
  Executed = 'executed',
  Failed = 'failed',
  Cancelled = 'cancelled',
  EmergencyReview = 'emergency-review',
}

export enum ProposalKind {
  Normal = 'normal',
  Emergency = 'emergency',
}

@Embeddable()
export class ProposalStep {
  @Property({ type: 'text' })
  stepName: string;
  @Property({ type: 'jsonb' })
  param: Record<string, any>;
}

@Entity()
export class Proposal extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<ProposalId> = createProposalId();
  @Enum(() => ProposalStatus)
  status: ProposalStatus = ProposalStatus.Pending;
  @Property({ type: 'text' })
  title: string;
  @Property({ type: 'jsonb' })
  steps: ProposalStep[];
  @Enum(() => ProposalKind)
  kind: ProposalKind = ProposalKind.Normal;
  @Property({ type: 'datetime' })
  startAt: Date;
  /**
   * @descriptioin 投票过期时间.
   */
  @Property({ type: 'datetime' })
  expiredAt: Date;
  @Property({ type: 'uuid' })
  creator: AccountId;

  @Property({ type: 'text' })
  failReason: Opt<string>;

  approve() {
    if (this.status !== ProposalStatus.Pending) {
      return err(new StatusError(ProposalStatus.Pending, this.status));
    }
    this.status = ProposalStatus.Approved;
    return ok();
  }
  reject() {
    if (this.status !== ProposalStatus.Pending) {
      return err(new StatusError(ProposalStatus.Pending, this.status));
    }
    this.status = ProposalStatus.Rejected;
    return ok();
  }
  controversy() {
    if (this.status !== ProposalStatus.Approved) {
      return err(new StatusError(ProposalStatus.Approved, this.status));
    }
    this.status = ProposalStatus.Controversy;
    return ok();
  }
  executing() {
    if (
      this.status !== ProposalStatus.Approved &&
      this.status !== ProposalStatus.Controversy
    ) {
      return err(new StatusError(ProposalStatus.Approved, this.status));
    }
    this.status = ProposalStatus.Executing;
    return ok();
  }
  executed() {
    if (this.status !== ProposalStatus.Executing) {
      return err(new StatusError(ProposalStatus.Executing, this.status));
    }
    this.status = ProposalStatus.Executed;
    return ok();
  }
  failed(reason: string) {
    this.status = ProposalStatus.Failed;
    this.failReason = reason;
    return ok();
  }

  cancel() {
    if (this.status !== ProposalStatus.Pending) {
      return err(new StatusError(ProposalStatus.Pending, this.status));
    }
    this.status = ProposalStatus.Cancelled;
    return ok();
  }

  emergency(){
    this.status = ProposalStatus.EmergencyReview;
  }
}

@Entity()
@Unique({ properties: ['proposalId', 'slotId'] })
export class ProposalSlot extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<ProposalVoteId> = createProposalVoteId();

  @Property({ type: 'uuid' })
  proposalId!: ProposalId;

  @Property({ type: 'int' })
  slotId!: number;

  @Property({ default: 0, type: 'int' })
  agreeCount!: number;

  @Property({ default: 0, type: 'int' })
  disagreeCount!: number;
}

export enum VoteKind {
  Agree,
  Disagree,
}

@Entity()
@Unique({ properties: ['proposalId', 'accountId'] })
export class Vote {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<VoteId> = createVoteId();
  @Enum(() => VoteKind)
  kind: VoteKind;
  @Property({ type: 'uuid' })
  accountId: AccountId;
  @Property({ type: 'uuid' })
  proposalId: ProposalId;
  @Property({ type: 'int' })
  slotId!: number;
}

export const getSlot = (val: string, mod: number) => {
  let hash = 0;
  for (let i = 0; i < val.length; i++) {
    const ch = val.charCodeAt(i);
    hash = (hash * 31 + ch) | 0;
  }
  return (hash >>> 0) % Math.max(mod, 1);
};
