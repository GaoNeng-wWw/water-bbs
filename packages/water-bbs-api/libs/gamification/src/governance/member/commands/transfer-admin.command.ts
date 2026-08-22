import { DomainError } from '@app/shared';
import { EntityManager, EntityRepository } from '@mikro-orm/sqlite';
import {
  Command,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { err, Result } from 'neverthrow';
import { AccountId } from 'src/auth';
import {
  GovernanceMember,
  MemberGrantType,
  MemberKind,
} from '../member.entity';
import { MemberNotActive } from '../error';
import { Temporal } from '@js-temporal/polyfill';
import { ok } from 'neverthrow';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AdminTransfered } from '../events';

export class TransferAdmin extends Command<Result<void, DomainError>> {
  constructor(
    public readonly oldAdminId: AccountId,
    public readonly newAdminId: AccountId,
  ) {
    super();
  }
}

@CommandHandler(TransferAdmin)
export class TransferAdminService implements ICommandHandler<TransferAdmin> {
  constructor(
    @InjectRepository(GovernanceMember)
    private readonly repo: EntityRepository<GovernanceMember>,
    private readonly em: EntityManager,
    private readonly eventBus: EventBus,
  ) {}
  async execute({
    oldAdminId,
    newAdminId,
  }: TransferAdmin): Promise<Result<void, DomainError>> {
    const oldAdminRecord = await this.repo.findOne({
      accountId: oldAdminId,
      kind: MemberKind.Admin,
    });
    if (!oldAdminRecord) {
      return err(new MemberNotActive());
    }
    await this.em.transactional(async (em) => {
      const adminRecord = this.em.create(GovernanceMember, {
        accountId: newAdminId,
        startedAt: new Date(),
        grantType: MemberGrantType.Succession,
        kind: MemberKind.Admin,
      });
      em.persist(adminRecord);
      oldAdminRecord.endedAt = new Date();
      const bdRecord = this.em.create(GovernanceMember, {
        accountId: oldAdminId,
        startedAt: new Date(),
        endedAt: new Date(
          Temporal.Now.zonedDateTimeISO().add({ months: 6 }).epochMilliseconds,
        ),
        kind: MemberKind.BD,
        grantType: MemberGrantType.Succession,
      });
      em.persist(bdRecord);
      await em.flush();
      await this.eventBus.publish(new AdminTransfered(newAdminId, oldAdminId));
    });
    return ok();
  }
}
