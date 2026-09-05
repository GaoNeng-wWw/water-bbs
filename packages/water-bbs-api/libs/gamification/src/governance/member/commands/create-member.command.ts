import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import {
  GovernanceMember,
  MemberGrantType,
  MemberId,
  MemberKind,
} from '../member.entity';
import { DomainError } from '@app/shared';
import { AccountId } from '../../../../../../src/auth';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { MemberAlreadyExists } from '../error';

export class CreateMember extends Command<Result<MemberId, DomainError>> {
  constructor(
    public readonly accountId: AccountId,
    public readonly startedAt: Date,
    public readonly endedAt: Date,
    public readonly kind: MemberKind,
    public readonly grantType: MemberGrantType,
  ) {
    super();
  }
}

@CommandHandler(CreateMember)
export class CreateMemberService implements ICommandHandler<CreateMember> {
  constructor(
    @InjectRepository(GovernanceMember)
    private readonly repo: EntityRepository<GovernanceMember>,
  ) {}
  async execute(command: CreateMember): Promise<Result<MemberId, DomainError>> {
    const dbMember = await this.repo.findOne({
      accountId: command.accountId,
      startedAt: {
        $lt: new Date(),
      },
      $or: [{ endedAt: null }, { endedAt: { $gt: new Date() } }],
    });
    if (dbMember) {
      return err(new MemberAlreadyExists());
    }
    const member = this.repo.create({
      accountId: command.accountId,
      grantType: command.grantType,
      kind: command.kind,
      startedAt: command.startedAt,
      endedAt: command.endedAt,
    });
    await this.repo.upsert(member);
    return ok(member.id);
  }
}
