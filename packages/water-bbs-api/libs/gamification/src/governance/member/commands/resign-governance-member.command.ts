import { DomainError } from '@app/shared';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Command,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { ok, Result } from 'neverthrow';
import { AccountId } from 'src/auth';
import { GovernanceMember } from '../member.entity';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Resign } from '../events';

export class ResignGovernanceMemberCommand extends Command<
  Result<void, DomainError>
> {
  constructor(public readonly accountId: AccountId) {
    super();
  }
}

@CommandHandler(ResignGovernanceMemberCommand)
export class ResignGovernanceMemberService implements ICommandHandler<ResignGovernanceMemberCommand> {
  constructor(
    @InjectRepository(GovernanceMember)
    private readonly repo: EntityRepository<GovernanceMember>,
    private readonly eventBus: EventBus,
  ) {}
  async execute({
    accountId,
  }: ResignGovernanceMemberCommand): Promise<Result<void, DomainError>> {
    const memberRecord = await this.repo.findOne({
      accountId,
      endedAt: {
        $gt: new Date(),
      },
    });
    if (!memberRecord) {
      return ok();
    }
    memberRecord.endedAt = new Date();
    await this.repo.upsert(memberRecord);
    await this.eventBus.publish(new Resign(accountId, memberRecord.endedAt));
    return ok();
  }
}
