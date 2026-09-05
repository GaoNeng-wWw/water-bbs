import { DomainError } from '@app/shared';
import { EntityRepository } from '@mikro-orm/sqlite';
import {
  Command,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { AccountId } from 'src/auth';
import { GovernanceMember } from '../member.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { MemberNotActive } from '../error';
import { RevokeGovernanceMembershipEvent } from '../events';

export class RevokeGovernanceMembership extends Command<
  Result<AccountId, DomainError>
> {
  constructor(
    public readonly accountId: AccountId,
    public readonly reason: string,
  ) {
    super();
  }
}

@CommandHandler(RevokeGovernanceMembership)
export class RevokeGovernanceMembershipService implements ICommandHandler<RevokeGovernanceMembership> {
  constructor(
    @InjectRepository(GovernanceMember)
    private readonly repo: EntityRepository<GovernanceMember>,
    private readonly eventBus: EventBus,
  ) {}
  async execute({
    accountId,
    reason,
  }: RevokeGovernanceMembership): Promise<Result<AccountId, DomainError>> {
    const activeMemberRecord = await this.repo.findOne({
      accountId,
      endedAt: {
        $gt: new Date(),
      },
    });
    if (!activeMemberRecord) {
      return err(new MemberNotActive());
    }
    activeMemberRecord.revoke(new Date(), reason);
    await this.repo.upsert(activeMemberRecord);
    this.eventBus.publish(
      new RevokeGovernanceMembershipEvent(
        accountId,
        activeMemberRecord.kind,
        new Date(),
        reason,
      ),
    );
    return ok(accountId);
  }
}
