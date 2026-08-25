import { type Opt } from '@mikro-orm/core';
import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { type AccountId } from '../../../../../src/auth';
import { v7 } from 'uuid';

export enum MemberKind {
  Admin = 'admin',
  BD = 'bd',
}

export type MemberId = string & { readonly __brand: unique symbol };
export const createMemberId = () => v7() as MemberId;

export enum MemberGrantType {
  Election = 'election',
  Succession = 'succession',
  Migration = 'migration',
}

@Entity({
  tableName: 'governance_member',
})
@Index({
  properties: ['accountId', 'kind'],
})
export class GovernanceMember {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<MemberId> = createMemberId();
  @Property({ type: 'uuid' })
  accountId: AccountId;
  @Enum(() => MemberKind)
  kind: MemberKind;
  @Property({ type: 'datetime' })
  startedAt: Date;
  @Property({ type: 'datetime', nullable: true })
  endedAt: Opt<Date>;
  @Property({ type: 'text', nullable: true })
  reason?: string;
  @Enum(() => MemberGrantType)
  grantType: MemberGrantType;
  isActive(now = new Date()) {
    return this.startedAt <= now && (!this.endedAt || this.endedAt > now);
  }

  hasBDAuthority(now?: Date) {
    return (
      this.isActive(now) &&
      (this.kind === MemberKind.BD || this.kind === MemberKind.Admin)
    );
  }
  canModerate(now?: Date) {
    return this.isActive(now) && this.hasBDAuthority(now);
  }
  canCreateEmergencyAction() {
    return this.hasBDAuthority() || this.isAdmin();
  }

  isAdmin() {
    return this.kind === MemberKind.Admin;
  }

  revoke(now = new Date(), reason?: string) {
    this.endedAt = now;
    this.reason = reason;
  }

  canResolveControversy() {
    return this.hasBDAuthority() || this.isAdmin();
  }
}
