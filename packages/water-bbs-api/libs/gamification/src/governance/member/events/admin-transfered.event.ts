import { IEvent } from '@nestjs/cqrs';
import { AccountId } from 'src/auth';

export class AdminTransfered implements IEvent {
  id = 'gamification.governance.member.admin-transfered';
  constructor(
    public readonly newAdminAccountId: AccountId,
    public readonly newBDAccountId: AccountId,
  ) {}
}
