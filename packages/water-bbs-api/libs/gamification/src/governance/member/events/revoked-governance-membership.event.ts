import { IEvent } from '@nestjs/cqrs';
import { MemberKind } from '../member.entity';

export class RevokeGovernanceMembershipEvent implements IEvent {
  id = 'gamification.governance.member.revoked';
  constructor(
    public readonly accountId: string,
    public readonly kind: MemberKind,
    public readonly revokedAt: Date,
    public readonly reason?: string,
  ) {}
}
